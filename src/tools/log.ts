/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */
import * as fs from 'fs';

const { app } = require('electron').remote;
const pkgJSON = require('../../package.json');

export enum LogType {
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error',
}

/**
 * Console logging class
 * Every log function will also write the same log in the log file.
 * Please use this if you want to log something to the console.
 */
export class Console {
    private static LOG_DIR_PATH = `${app.getPath('userData')}/logs`;

    private static LOG_FILE_PATH = `${app.getPath('userData')}/logs/log.txt`;

    /**
     * Emits a warning message in the console and writes a new line in the log file.
     * @param className - The name where the function is called.
     * @param message - The log messe.
     * @param data - Any kind of data (variables, objects, etc...).
     */
    public static warn(className: string, message: string, ...data: any[]): void {
        this.emitLog(className, message, data, LogType.WARN);
    }

    /**
     * Emits an error message in the console and writes a new line in the log file.
     * @param className - The name where the function is called.
     * @param message - The log messe.
     * @param data - Any kind of data (variables, objects, etc...).
     */
    public static error(className: string, message: string, ...data: any[]): void {
        this.emitLog(className, message, data, LogType.ERROR);
    }

    /**
     * Emits an info message in the console and writes a new line in the log file.
     * @param className - The name where the function is called.
     * @param message - The log messe.
     * @param data - Any kind of data (variables, objects, etc...).
     */
    public static info(className: string, message: string, ...data: any[]): void {
        this.emitLog(className, message, data, LogType.INFO);
    }

    private static emitLog(
        className: string,
        msg: string,
        data: any[],
        type: LogType.ERROR | LogType.WARN | LogType.INFO
    ) {
        if (data.length > 0) {
            console[type](msg, data);
        } else {
            console[type](msg);
        }

        this.writeToFile(className, msg, type);
    }

    /**
     * Creates log file and write versions in the log file
     */
    public static initLog() {
        if (!fs.existsSync(this.LOG_DIR_PATH)) {
            fs.mkdirSync(this.LOG_DIR_PATH);
        }
        if (fs.existsSync(this.LOG_FILE_PATH)) {
            fs.unlinkSync(this.LOG_FILE_PATH);
        }

        const stream = fs.createWriteStream(this.LOG_FILE_PATH, { flags: 'a' });

        const tuneVer = `PROGRAM VERSION: ${pkgJSON.version}`;
        const electronVer = `ELECTRON VERSION: ${process.versions.electron}`;
        const nodeVer = `NODE VERSION: ${process.version}`;
        const versions = `${tuneVer}\n${electronVer}\n${nodeVer}`;

        stream.write(versions);
        stream.end();

        this.writeToFile('INIT', 'LOG FILE CREATED', LogType.INFO);
    }

    /**
     * Writes a new line in the log document.
     * @param name - Name of the component where the log function was called.
     * @param msg - Log mesasge.
     * @param type - Type of the log.
     */
    private static writeToFile(name: string, msg: string, type: LogType): boolean {
        if (!fs.existsSync(this.LOG_FILE_PATH)) {
            return false;
        }

        const stream = fs.createWriteStream(this.LOG_FILE_PATH, { flags: 'a' });

        // log line creation
        const time = new Date();
        const timeString = time.toLocaleTimeString();
        const logName = name.toUpperCase();
        const logType = type.toUpperCase();

        const msgFormatted = `\n[${timeString}] [${logName}] [${logType}] ${msg}`;

        stream.write(msgFormatted);
        stream.end();

        return true;
    }
}
