import fs from 'fs';
import path from 'path';
import { IPlaylist } from '../../typings/playlist';

export type DatabaseValue = IPlaylist[] | undefined;
export type DatabaseKey = 'playlists';

export type Tables = {
	[key in DatabaseKey]: DatabaseValue;
};

const DEFAULT_DB: Tables = {
	playlists: []
};

export default class Database {
	private filePath: string;

	private data!: Tables;

	constructor(dir: string) {
		this.filePath = path.join(dir, 'db');

		if (!fs.existsSync(this.filePath)) {
			fs.writeFileSync(this.filePath, JSON.stringify(DEFAULT_DB));
		}

		const rawJson = fs.readFileSync(this.filePath, 'utf-8');
		if (Database.validate(rawJson)) {
			this.data = JSON.parse(rawJson);
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

	static validate(json: string) {
		try {
			JSON.parse(json);
		} catch (err) {
			return false;
		}

		return true;
	}
}
