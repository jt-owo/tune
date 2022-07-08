import { contextBridge, ipcRenderer } from 'electron';
import Database, { DatabaseKey, DatabaseValue } from './api/database';
import WindowChannels from './ipc/windowChannels';

// FIXME: eventually switch to init method.
let db: Database;

(async () => {
	const path = await ipcRenderer.invoke('get-path', 'userData');
	db = new Database(path);
})();

contextBridge.exposeInMainWorld('electron', {
	ipc: {
		window: {
			minimize() {
				ipcRenderer.send(WindowChannels.MINIMIZE_WINDOW);
			},
			maximize() {
				ipcRenderer.send(WindowChannels.MAXIMIZE_WINDOW);
			},
			close() {
				ipcRenderer.send(WindowChannels.CLOSE_WINDOW);
			}
		},
		playlist: {
			async addTracks() {
				const paths = await ipcRenderer.invoke('add-tracks');

				return paths as string[];
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
