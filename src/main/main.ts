/* eslint-disable consistent-return */
/* eslint @typescript-eslint/no-var-requires: off, global-require: off */
import { App, app, dialog, IpcMain, ipcMain, protocol } from 'electron';
import { IpcChannel } from './ipc/types';
import { CloseWindowChannel, MinimizeWindowChannel, MaximizeWindowChannel } from './ipc/channels';
import Window from './window/window';
import AudioParser from './api/audioParser';

if (process.env.NODE_ENV === 'production') {
	const sourceMapSupport = require('source-map-support');
	sourceMapSupport.install();
}

const isDebug = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
	require('electron-debug')();
}

class Main {
	/** Electron App instance */
	private app: App;

	/** Electron IpcMain instance */
	private ipcMain: IpcMain;

	/** Electron main window instance */
	private mainWindow!: Window;

	constructor(_app: App, _ipcMain: IpcMain) {
		this.app = _app;
		this.ipcMain = _ipcMain;

		this.app.on('ready', () => {
			this.onReady();
		});

		this.app.on('window-all-closed', () => {
			this.onWindowAllClosed();
		});

		this.initIpc([new CloseWindowChannel(), new MinimizeWindowChannel(), new MaximizeWindowChannel()]);
	}

	// FIXME: Rewrite IpcChannels
	/**
	 * Initializes the {@link ipcMain} channels.
	 * @param channels Channels to initialize.
	 */
	private initIpc(channels: IpcChannel[]) {
		channels.forEach((channel) => {
			this.ipcMain.on(channel.getName(), (event, request) => channel.handle(event, request));
		});

		ipcMain.handle('add-tracks', async () => {
			const result = await dialog.showOpenDialog({
				properties: ['openFile', 'multiSelections'],
				filters: [{ name: 'Audio Files', extensions: ['mp3', 'flac'] }]
			});

			return [...result.filePaths];
		});

		ipcMain.handle('get-path', (_event, type) => {
			return app.getPath(type);
		});

		ipcMain.handle('get-metadata', (_event, filePath) => {
			return AudioParser.getMetadata(filePath);
		});
	}

	private onReady() {
		this.mainWindow = new Window();

		this.app.on('activate', () => {
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
			this.app.quit();
		}
	}

	private onActivate() {
		if (!this.mainWindow) {
			this.mainWindow = new Window();
		}
	}
}

// eslint-disable-next-line no-new
new Main(app, ipcMain);
