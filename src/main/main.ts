/* eslint class-methods-use-this: off, @typescript-eslint/no-var-requires: off, global-require: off */
import { app, ipcMain } from 'electron';
import Window from './window';

if (process.env.NODE_ENV === 'production') {
	const sourceMapSupport = require('source-map-support');
	sourceMapSupport.install();
}

const isDebug = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
	require('electron-debug')();
}

class Main {
	private mainWindow!: Window;

	constructor() {
		app.on('ready', () => {
			this.onReady();
		});

		app.on('window-all-closed', () => {
			this.onWindowAllClosed();
		});
	}

	private onReady() {
		this.mainWindow = new Window();

		app.on('activate', () => {
			this.onActivate();
		});

		ipcMain.on('ipc-example', async (event, arg) => {
			const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
			// eslint-disable-next-line no-console
			console.log(msgTemplate(arg));
			event.reply('ipc-example', msgTemplate('pong'));
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
