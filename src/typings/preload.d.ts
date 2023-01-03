import { DatabaseKey, DatabaseValue } from '../main/api/database';
import { StoreValue } from '../main/api/dynamicStore';

interface TuneAPI {
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
}

declare global {
	interface Window {
		ipc: {
			window: {
				minimize(): void;
				maximize(): void;
				close(): void;
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
		};
		process: {
			platform: string;
		};
		tuneAPI: TuneAPI;
	}
}

export {};
