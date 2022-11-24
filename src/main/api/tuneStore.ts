/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-explicit-any */

// TODO: Remove

import { IFileWriter, JsonFileWriter } from '../util/fileWriter';

export type StoreValue = number | string | boolean | object;

export interface IStoreData {
	[key: string]: StoreValue;
}

export class UserPrefStore {
	private data: IStoreData;

	private fileWriter: IFileWriter<IStoreData>;

	/**
	 * Creates a new instance of the {@link UserPrefStore} class.
	 */
	constructor(defaults: IStoreData) {
		this.fileWriter = new JsonFileWriter<IStoreData>('userPref');

		this.data = this.fileWriter.read(defaults);
	}

	/**
	 * Returns the value that is assigned to the key param.
	 * @param key Store key.
	 * @returns store value assigned to the key.
	 */
	get<T>(key: string): T | null {
		if (this.data) {
			return this.data[key] as unknown as T;
		}

		return null;
	}

	/**
	 * Sets a store value that is assigned to the key param.
	 * @param key Store key.
	 * @param value Value that should be stored.
	 */
	set(key: string, value: StoreValue) {
		if (!this.data) {
			this.data = {};
			this.data[key] = value;
		}

		this.data[key] = value;
		this.fileWriter.write(this.data);
	}
}
