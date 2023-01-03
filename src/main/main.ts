/* eslint-disable class-methods-use-this */
/* eslint @typescript-eslint/no-var-requires: off, global-require: off */
import { app, ipcMain, protocol } from 'electron';
import { IpcChannel } from './ipc/types';
import Window from './window/window';
import Database from './api/database';
import { OpenUrlChannel, ReadMetadataChannel, SelectFileChannel, WindowControlChannel } from './ipc';
import Channels from './ipc/channel';
import { DynamicStore } from './api/dynamicStore';
import { UserConfig } from '../typings/config';

if (process.env.NODE_ENV === 'production') {
	const sourceMapSupport = require('source-map-support');
	sourceMapSupport.install();
}

const isDebug = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
	require('electron-debug')();
}

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
	private database!: Database;

	/** Config file instance */
	private configFile!: DynamicStore;

	constructor() {
		app.on('ready', () => {
			this.onReady();
		});

		app.on('window-all-closed', () => {
			this.onWindowAllClosed();
		});

		this.initIpc([new WindowControlChannel(), new ReadMetadataChannel(), new SelectFileChannel(), new OpenUrlChannel()]);
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

		ipcMain.on(Channels.DATABASE_GET, (event, args) => {
			const key = args;

			// eslint-disable-next-line no-param-reassign
			event.returnValue = this.database.get(key);
		});

		ipcMain.handle(Channels.DATABASE_SET, (_event, args) => {
			const key = args[0];
			const value = args[1];

			if (Database.validate(value)) this.database.set(key, JSON.parse(value));
		});

		ipcMain.on(Channels.CONFIG_GET, (event, args) => {
			const key = args;

			// eslint-disable-next-line no-param-reassign
			event.returnValue = this.configFile.get(key);
		});

		ipcMain.handle(Channels.CONFIG_SET, (_event, args) => {
			const key = args[0];
			const value = args[1];

			if (Database.validate(value)) this.configFile.set(key, JSON.parse(value));
		});
	}

	private onReady() {
		this.database = new Database(app.getPath('userData'));
		this.configFile = new DynamicStore('userConfig', USER_CONFIG_DEFAULTS);
		this.mainWindow = new Window(this.configFile);

		app.on('activate', () => {
			this.onActivate();
		});

		protocol.registerFileProtocol('tune', (request, callback) => {
			const url = request.url.replace('tune://getMediaFile/', '');
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

// eslint-disable-next-line no-new
new Main();
