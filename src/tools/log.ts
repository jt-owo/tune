import * as fs from 'fs';

const { app } = require('electron').remote;
const pkgJSON = require('../../package.json');

const logDir = `${app.getPath('userData')}/logs`;
const logFile = `${logDir}/log.txt`;

export enum LogType {
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR',
}

/**
 * Creates log file and write versions in the log file
 */
export function init() {
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir);
    }
    if (fs.existsSync(logFile)) {
        fs.unlinkSync(logFile);
    }

    const stream = fs.createWriteStream(logFile, { flags: 'a' });

    const tuneVer = `PROGRAM VERSION: ${pkgJSON.version}`;
    const electronVer = `\nELECTRON VERSION: ${process.versions.electron}`;
    const nodeVer = `\nNODE VERSION: ${process.version}`;
    const versions = tuneVer + electronVer + nodeVer;

    stream.write(versions);
    stream.end();

    log('INIT', 'LOG FILE CREATED', LogType.INFO);
}

/**
 * Writes a new line in the log document.
 * @param {string} name - Name of the component where the log function was called.
 * @param {string} msg - Log mesasge.
 * @param {Types} type - Type of the log.
 */
export function log(name: string, msg: string, type: LogType): boolean {
    if (!fs.existsSync(logFile)) {
        return false;
    }

    const stream = fs.createWriteStream(logFile, { flags: 'a' });

    // log line creation
    const time = new Date();
    const timeString = time.toLocaleTimeString();
    const logName = name.toUpperCase();

    const msgFormatted = `\n[${timeString}] [${logName}] [${type}] ${msg}`;

    stream.write(msgFormatted);
    stream.end();

    return true;
}
