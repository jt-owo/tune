import { IFileWriter, JsonFileWriter } from '../util/fileWriter';

export type StoreValue = number | string | boolean | object;

export interface IStoreData {
	[key: string]: StoreValue;
}

export class DynamicStore {
	private data: IStoreData;

	private fileWriter: IFileWriter<IStoreData>;

	/**
	 * Creates a new instance of the {@link DynamicStore} class.
	 *
	 * A dynamic store is used for something like a client config file.
	 * @param storeName Name of the dynamic store.
	 * @param defaults Default value of the dynamic store data.
	 */
	constructor(storeName: string, defaults: IStoreData) {
		this.fileWriter = new JsonFileWriter<IStoreData>(storeName);
		this.data = this.fileWriter.read(defaults);
	}

	/**
	 * Returns the value that is assigned to the key param.
	 * @param key Store key.
	 * @returns store value assigned to the key.
	 */
	get<T>(key: string): T | null {
		if (!this.data) {
			return null;
		}

		return this.data[key] as T;
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
