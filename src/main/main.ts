/* eslint-disable class-methods-use-this */
/* eslint-disable consistent-return */
/* eslint @typescript-eslint/no-var-requires: off, global-require: off */
import { app, ipcMain, protocol } from 'electron';
import { IpcChannel } from './ipc/types';
import { CloseWindowChannel, MinimizeWindowChannel, MaximizeWindowChannel, DirectoryPathChannel, ReadMetadataChannel, AddTracksChannel } from './ipc/channels';
import Window from './window/window';

if (process.env.NODE_ENV === 'production') {
	const sourceMapSupport = require('source-map-support');
	sourceMapSupport.install();
}

const isDebug = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
	require('electron-debug')();
}

class Main {
	/** Electron main window instance */
	private mainWindow!: Window;

	constructor() {
		app.on('ready', () => {
			this.onReady();
		});

		app.on('window-all-closed', () => {
			this.onWindowAllClosed();
		});

		this.initIpc([new CloseWindowChannel(), new MinimizeWindowChannel(), new MaximizeWindowChannel(), new DirectoryPathChannel(), new ReadMetadataChannel(), new AddTracksChannel()]);
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
	}

	private onReady() {
		this.mainWindow = new Window();

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
			this.mainWindow = new Window();
		}
	}
}

// eslint-disable-next-line no-new
new Main();
