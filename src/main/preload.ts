import { contextBridge, ipcRenderer } from 'electron';
import Database, { DatabaseKey, DatabaseValue } from './api/database';
import MiscChannels from './ipc/miscChannels';
import WindowChannels from './ipc/windowChannels';

// TODO: maybe switch to init method.
let db: Database;

(async () => {
	const path = await ipcRenderer.invoke(MiscChannels.GET_PATH, 'userData');
	db = new Database(path);
})();

contextBridge.exposeInMainWorld('electron', {
	ipc: {
		window: {
			minimize() {
				ipcRenderer.invoke(WindowChannels.MINIMIZE_WINDOW);
			},
			maximize() {
				ipcRenderer.invoke(WindowChannels.MAXIMIZE_WINDOW);
			},
			close() {
				ipcRenderer.invoke(WindowChannels.CLOSE_WINDOW);
			}
		},
		playlist: {
			async addTracks() {
				const paths = await ipcRenderer.invoke(MiscChannels.ADD_TRACKS);

				return paths as string[];
			}
		},
		parser: {
			async getMetadata(file: string) {
				const metadata = await ipcRenderer.invoke(MiscChannels.GET_METADATA, file);

				return metadata as string;
			}
		}
	}
});

contextBridge.exposeInMainWorld('process', {
	platform: process.platform
});

contextBridge.exposeInMainWorld('tuneApi', {
	db: {
		set(key: DatabaseKey, value: string) {
			if (Database.validate(value)) db.set(key, JSON.parse(value));
		},
		get(key: DatabaseKey): DatabaseValue {
			return db.get(key);
		}
	}
});
