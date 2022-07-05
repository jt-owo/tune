/* eslint @typescript-eslint/no-var-requires: off, max-classes-per-file: off, no-new: off, no-console: off, class-methods-use-this: off, global-require: off */
import { app, BrowserWindow, shell } from 'electron';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';
import path from 'path';
import { IStoreData, UserPrefStore } from '../db/tuneStore';
import { resolveHtmlPath } from '../util';
import MenuBuilder from './menu';

export interface UserPref extends IStoreData {
	windowBounds: WindowBounds;
	windowState: number;
}

export interface WindowBounds {
	width: number;
	height: number;
	x: number;
	y: number;
}

class AppUpdater {
	constructor() {
		log.transports.file.level = 'info';
		autoUpdater.logger = log;
		autoUpdater.checkForUpdatesAndNotify();
	}
}

const USER_DEFAULTS: UserPref = {
	windowBounds: {
		width: 0,
		height: 0,
		x: 0,
		y: 0
	},
	windowState: 0
};

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
const MIN_WIDTH = 960;

/** @const minimum height of the window */
const MIN_HEIGHT = 640;

export default class Window {
	private browserWindow: BrowserWindow | null;

	private userPref: UserPrefStore;

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

		this.userPref = new UserPrefStore(USER_DEFAULTS);

		const winBounds = this.userPref.get<WindowBounds>('windowBounds');
		if (winBounds) {
			this.browserWindow.setBounds(winBounds);
		} else {
			this.browserWindow.center();
		}

		const winState = this.userPref.get<number>('windowState');
		if (winState) {
			this.browserWindow.maximize();
		}

		this.browserWindow.loadURL(resolveHtmlPath('index.html'));

		this.browserWindow.on('ready-to-show', () => {
			this.onReadyToShow();
		});

		this.browserWindow.on('resize', () => {
			this.onResize();
		});

		this.browserWindow.on('move', () => {
			this.onMove();
		});

		this.browserWindow.on('close', () => {
			this.onClose();
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

	private onReadyToShow() {
		if (!this.browserWindow) {
			throw new Error('"browserWindow" is not defined');
		}

		if (process.env.START_MINIMIZED) {
			this.browserWindow.minimize();
		} else {
			this.browserWindow.show();
		}
	}

	private onResize() {
		this.saveWindowBounds();
		this.saveWindowState();
	}

	private onMove() {
		this.saveWindowBounds();
	}

	private onClose() {
		this.saveWindowBounds();
		this.saveWindowState();
	}

	private saveWindowBounds() {
		if (!this.browserWindow) return;

		const { width, height } = this.browserWindow.getBounds();

		const winPos = this.browserWindow.getPosition();
		const x = winPos[0];
		const y = winPos[1];

		this.userPref.set('windowBounds', {
			width,
			height,
			x,
			y
		});
	}

	private saveWindowState() {
		if (!this.browserWindow) return;

		const state = this.browserWindow.isMaximized() ? 1 : 0;
		this.userPref.set('windowState', state);
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
