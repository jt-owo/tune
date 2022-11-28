/* eslint-disable @typescript-eslint/no-explicit-any */
import { app } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

export interface FileInfo {
	name: string;
	ext: string;
	path: string;
}

export interface IFileWriter<T> {
	file: FileInfo;
	read(defaults: T): T;
	write(object: T): void;
}

export interface IAsyncFileWriter<T> {
	file: FileInfo;
	read(defaults: T): Promise<T>;
	write(object: T): Promise<void>;
}

export class JsonFileWriter<T> implements IFileWriter<T> {
	public file: FileInfo;

	constructor(fileName: string, fileExt = '') {
		const userDataPath = app.getPath('userData');

		this.file = {
			name: fileName,
			ext: fileExt !== '' ? `.${fileExt}` : '',
			path: path.join(userDataPath, fileName + fileExt)
		};
	}

	read(defaults: T): T {
		let data;

		try {
			data = fs.readFileSync(this.file.path, 'utf-8');
		} catch (e) {
			return defaults;
		}

		return JSON.parse(data) as T;
	}

	write(object: T): void {
		return fs.writeFileSync(this.file.path, JSON.stringify(object, null, 2));
	}
}
