import fs from 'fs';
import path from 'path';
import Json from '../util/jsonHelper';

export type DatabaseValue = IPlaylist[] | string | number | undefined;
export type DatabaseKey = 'playlists' | 'version' | 'libPath';

type Data = {
	[key in DatabaseKey]: DatabaseValue;
};

const DATA_FILE_VERSION = 0;

const DEFAULT_DATA: Data = {
	version: DATA_FILE_VERSION,
	libPath: '',
	playlists: []
};

export default class TuneLibrary {
	private filePath: string;

	private data: Data;

	/**
	 * Initializes the db.
	 * @param dir Path where the db file is located.
	 */
	constructor(dir: string) {
		this.filePath = path.join(dir, 'data');

		if (!fs.existsSync(this.filePath)) {
			fs.writeFileSync(this.filePath, JSON.stringify(DEFAULT_DATA));
		}

		const rawJson = fs.readFileSync(this.filePath, 'utf-8');
		if (Json.validate<Data>(rawJson)) {
			this.data = JSON.parse(rawJson);

			// Overwrite file if version doesn't match. Mainly used for development.
			if (this.data.version !== DATA_FILE_VERSION) this.data = DEFAULT_DATA;
		} else {
			throw new Error('Error initializing database.');
		}
	}

	set(key: DatabaseKey, value: DatabaseValue) {
		this.data[key] = value;
		this.write();
	}

	get(key: DatabaseKey): DatabaseValue | undefined {
		return this.data[key];
	}

	/**
	 * Checks if a key already exists.
	 * @param key Key to check
	 * @returns True if the key already exists.
	 */
	exists(key: DatabaseKey): boolean {
		return Object.prototype.hasOwnProperty.call(this.data, key);
	}

	delete(key: DatabaseKey): boolean {
		let ok = false;
		if (this.exists(key)) {
			ok = delete this.data[key];
			this.write();
		}

		return ok;
	}

	private write() {
		try {
			fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2));
		} catch (err) {
			throw new Error(`Cannot access file: ${this.filePath}`);
		}
	}
}
