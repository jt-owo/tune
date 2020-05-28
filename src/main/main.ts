import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import * as url from 'url';
import * as fs from 'fs';

const MIN_WIDTH = 700;
const MIN_HEIGHT = 450;

const settingsPath = `${app.getPath('userData')}/settings.json`;
const defaultSettings = { dummy: '' };

let win: BrowserWindow | null;

const installExtensions = async () => {
    const installer = require('electron-devtools-installer');
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
    const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

    return Promise.all(
        extensions.map((name) => installer.default(installer[name], forceDownload))
    ).catch(console.log); // eslint-disable-line no-console
};

const createWindow = async () => {
    if (process.env.NODE_ENV !== 'production') {
        await installExtensions();
    }

    win = new BrowserWindow({
        width: 1280,
        height: 720,
        minWidth: MIN_WIDTH,
        minHeight: MIN_HEIGHT,
        show: false,
        frame: false,
        titleBarStyle: 'hiddenInset',
        webPreferences: { nodeIntegration: true, webSecurity: false },
    });

    if (process.env.NODE_ENV !== 'production') {
        process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = '1';
        win.loadURL(`http://localhost:2003`);
    } else {
        win.loadURL(
            url.format({
                pathname: path.join(__dirname, 'index.html'),
                protocol: 'file:',
                slashes: true,
            })
        );
    }

    if (process.env.NODE_ENV !== 'production') {
        win.webContents.once('dom-ready', () => {
            win!.webContents.openDevTools();
        });
    }

    win.once('ready-to-show', win!.show);

    win.on('closed', () => {
        win = null;
    });
};

app.on('ready', () => {
    app.name = 'tune.';
    checkSettings();
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});

/**
 * Checks if the settings file exists.
 *
 * The JSON file will be loaded into a global variable or the file will be created
 */
function checkSettings() {
    global.settings = defaultSettings;

    if (!fs.existsSync(settingsPath)) {
        fs.writeFileSync(settingsPath, JSON.stringify(defaultSettings));
    } else {
        global.settings = JSON.parse(fs.readFileSync(settingsPath).toString());
    }
}
