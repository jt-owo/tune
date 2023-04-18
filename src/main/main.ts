/* eslint @typescript-eslint/no-var-requires: off, global-require: off, class-methods-use-this: off, no-new: off */
import { app, ipcMain, protocol } from 'electron';
import dotenv from 'dotenv';
import Window from './window/window';
import TuneLibrary from './library';
import DiscordClient from './api/discordClient';
import { OpenUrlChannel, LoadMetadataChannel, SelectFileChannel, WindowControlChannel } from './ipc';
import { IpcChannel } from './ipc/types';
import Channels from './ipc/channel';
import { DynamicStore } from './api/dynamicStore';
import Json from '../util/jsonHelper';
import { UserConfig } from '../typings/config';

if (process.env.NODE_ENV === 'production') {
	const sourceMapSupport = require('source-map-support');
	sourceMapSupport.install();
}

const isDebug = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';
if (isDebug) require('electron-debug')();

const USER_CONFIG_DEFAULTS: UserConfig = {
	windowBounds: {
		width: 0,
		height: 0,
		x: 0,
		y: 0
	},
	windowState: 0,
	volume: 25,
	outputDeviceId: 'default'
};

class Main {
	/** Electron main window instance */
	private mainWindow!: Window;

	/** JSON database instance */
	private database!: TuneLibrary;

	/** Config file instance */
	private configFile!: DynamicStore;

	/** Discord Client instance */
	private discord?: DiscordClient;

	constructor() {
		app.on('ready', () => {
			// Load contents from .env file into process.env.
			dotenv.config();
			this.onReady();
		});

		app.on('window-all-closed', () => {
			this.onWindowAllClosed();
		});

		this.initIpc([new WindowControlChannel(), new LoadMetadataChannel(), new SelectFileChannel(), new OpenUrlChannel()]);
	}

	/**
	 * Initializes the {@link ipcMain} channels.
	 * @param channels Channels to initialize.
	 */
	private initIpc(channels: IpcChannel<unknown, unknown>[]) {
		channels.forEach((channel) => {
			ipcMain.handle(channel.getName(), (event, args) => {
				return channel.handle(event, args);
			});
		});

		this.initSpecialChannels();
	}

	private initSpecialChannels() {
		ipcMain.on(Channels.DATABASE_GET, (event, args) => {
			const key = args;

			// eslint-disable-next-line no-param-reassign
			event.returnValue = this.database.get(key);
		});

		ipcMain.handle(Channels.DATABASE_SET, (_event, args) => {
			const key = args[0];
			const value = args[1];

			if (Json.validate(value)) this.database.set(key, JSON.parse(value));
		});

		ipcMain.on(Channels.CONFIG_GET, (event, args) => {
			const key = args;

			// eslint-disable-next-line no-param-reassign
			event.returnValue = this.configFile.get(key);
		});

		ipcMain.handle(Channels.CONFIG_SET, (_event, args) => {
			const key = args[0];
			const value = args[1];

			if (Json.validate(value)) this.configFile.set(key, JSON.parse(value));
		});
	}

	private onReady() {
		this.database = new TuneLibrary(app.getPath('userData'));
		this.configFile = new DynamicStore('userConfig', USER_CONFIG_DEFAULTS);
		this.mainWindow = new Window(this.configFile);

		const clientId = process.env.TUNE_DISCORD_CLIENT_ID;
		if (clientId) this.discord = new DiscordClient(clientId);

		app.on('activate', () => {
			this.onActivate();
		});

		protocol.registerFileProtocol('tune', (request, callback) => {
			const url = request.url.replace('tune://file/', '');
			try {
				return callback(url);
			} catch (error) {
				// eslint-disable-next-line no-console
				console.error(error);
				return callback('404');
			}
		});
	}

	private onWindowAllClosed() {
		if (process.platform !== 'darwin') {
			app.quit();
		}
	}

	private onActivate() {
		if (!this.mainWindow) {
			this.mainWindow = new Window(this.configFile);
		}
	}
}

new Main();
