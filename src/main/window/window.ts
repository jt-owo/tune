/* eslint @typescript-eslint/no-var-requires: off, max-classes-per-file: off, no-new: off, no-console: off, class-methods-use-this: off, global-require: off */
import { app, BrowserWindow, shell } from 'electron';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';
import path from 'path';
import MenuBuilder from './menu';
import { resolveHtmlPath } from '../util';

class AppUpdater {
	constructor() {
		log.transports.file.level = 'info';
		autoUpdater.logger = log;
		autoUpdater.checkForUpdatesAndNotify();
	}
}

const isDebug = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';
const RESOURCES_PATH = app.isPackaged ? path.join(process.resourcesPath, 'assets') : path.join(__dirname, '../../assets');

const installExtensions = async () => {
	const installer = require('electron-devtools-installer');
	const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
	const extensions = ['REACT_DEVELOPER_TOOLS'];

	return installer
		.default(
			extensions.map((name) => installer[name]),
			forceDownload
		)
		.catch(console.log);
};

/** @const minimum width of the window */
const MIN_WIDTH = 720;

/** @const minimum height of the window */
const MIN_HEIGHT = 540;

export default class Window {
	private browserWindow: BrowserWindow | null;

	constructor() {
		if (isDebug) {
			this.installExtensions();
		}

		const getAssetPath = (...paths: string[]): string => {
			return path.join(RESOURCES_PATH, ...paths);
		};

		this.browserWindow = new BrowserWindow({
			icon: getAssetPath('icon.png'),
			minWidth: MIN_WIDTH,
			minHeight: MIN_HEIGHT,
			show: false,
			frame: false,
			titleBarStyle: 'hiddenInset',
			webPreferences: {
				nodeIntegration: false /* DO NOT CHANGE */,
				contextIsolation: true /* DO NOT CHANGE */,
				webSecurity: true /* DO NOT CHANGE */,
				devTools: process.env.NODE_ENV !== 'production',
				preload: app.isPackaged ? path.join(__dirname, 'preload.js') : path.join(__dirname, '../../../webpack/dll/preload.js')
			}
		});

		this.browserWindow.loadURL(resolveHtmlPath('index.html'));

		this.browserWindow.on('ready-to-show', () => {
			if (!this.browserWindow) {
				throw new Error('"browserWindow" is not defined');
			}

			if (process.env.START_MINIMIZED) {
				this.browserWindow.minimize();
			} else {
				this.browserWindow.show();
			}
		});

		this.browserWindow.on('closed', () => {
			this.browserWindow = null;
		});

		const menuBuilder = new MenuBuilder(this.browserWindow);
		menuBuilder.buildMenu();

		// Open urls in the user's browser
		this.browserWindow.webContents.setWindowOpenHandler((edata) => {
			shell.openExternal(edata.url);
			return { action: 'deny' };
		});

		new AppUpdater();
	}

	/**
	 * Closes the underlying browser window.
	 */
	public close() {
		this.browserWindow?.close();
	}

	/**
	 * Minimizes the underlying browser window.
	 */
	public maximize() {
		this.browserWindow?.maximize();
	}

	/**
	 * Minimizes the underlying browser window.
	 */
	public minimize() {
		this.browserWindow?.minimize();
	}

	/**
	 * Installs dev extensions.
	 */
	private async installExtensions() {
		if (process.env.NODE_ENV !== 'production') {
			await installExtensions();
		}
	}
}
