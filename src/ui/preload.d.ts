import { DatabaseKey, DatabaseValue } from '../main/api/database';

interface TuneApi {
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
		electron: {
			ipc: {
				window: {
					minimize(): void;
					maximize(): void;
					close(): void;
				};
				playlist: {
					addTracks(): Promise<string[]>;
				};
				parser: {
					getMetadata(file: string): Promise<string>;
				};
			};
		};
		process: {
			platform: string;
		};
		tuneApi: TuneApi;
	}
}

export {};
