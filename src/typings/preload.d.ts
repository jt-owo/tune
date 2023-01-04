import { DatabaseKey, DatabaseValue } from '../main/api/database';
import { StoreValue } from '../main/api/dynamicStore';

interface TuneAPI {
	minimize(): void;
	maximize(): void;
	close(): void;
	db: {
		/**
		 * Sets a value in the JSON database.
		 * @param key Storage key
		 * @param value Value to store. Must be a valid JSON string.
		 */
		set(key: DatabaseKey, value: string): void;
		/**
		 * Gets a value from the JSON database.
		 * @param key Storage key
		 * @returns Storage value
		 */
		get(key: DatabaseKey): DatabaseValue;
	};
	system: {
		selectFiles(): Promise<string[]>;
		readMetadata(file: string): Promise<string>;
		openURL(url: string): Promise<void>;
		updateTrack(trackPath: string): void;
	};
	config: {
		/**
		 * Sets a value in the config file.
		 * @param key Storage key
		 * @param value Value to store. Must be a valid JSON string.
		 */
		set(key: string, value: string): void;
		/**
		 * Gets a value from the config file.
		 * @param key Storage key
		 * @returns Storage value
		 */
		get(key: string): StoreValue;
	};
}

declare global {
	interface Window {
		process: {
			platform: string;
		};
		api: TuneAPI;
	}
}

export {};
