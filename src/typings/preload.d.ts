import { DatabaseKey, DatabaseValue } from '../main/library';
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
		loadMetadata(trackJSON: string): Promise<string>;
		openURL(url: string): Promise<void>;
		setTrack(name: string, artists: string, album: string): void;
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
			/**
			 * The `window.process.platform` property returns a string identifying the operating system platform.
			 *
			 * Currently possible values are:
			 *
			 * * `'darwin'`
			 * * `'linux'`
			 * * `'win32'`
			 */
			readonly platform: string;
		};
		/**
		 * API to access main renderer
		 */
		api?: TuneAPI;
	}
}

export {};
