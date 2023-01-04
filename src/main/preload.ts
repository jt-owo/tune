import { contextBridge, ipcRenderer } from 'electron';
import { DatabaseKey, DatabaseValue } from './api/database';
import { StoreValue } from './api/dynamicStore';
import Channels from './ipc/channel';

contextBridge.exposeInMainWorld('process', {
	platform: process.platform
});

contextBridge.exposeInMainWorld('api', {
	system: {
		async selectFiles() {
			const paths = await ipcRenderer.invoke(Channels.SELECT_FILE);

			return paths as string[];
		},
		async readMetadata(file: string) {
			const metadata = await ipcRenderer.invoke(Channels.READ_METADATA, file);

			return metadata as string;
		},
		openURL(url: string) {
			ipcRenderer.invoke(Channels.OPEN_URL, url);
		},
		updateTrack(trackPath: string) {
			ipcRenderer.invoke(Channels.UPDATE_TRACK_MAIN, trackPath);
		}
	},
	config: {
		set(key: string, value: string) {
			ipcRenderer.invoke(Channels.CONFIG_SET, [key, value]);
		},
		get(key: string): StoreValue {
			return ipcRenderer.sendSync(Channels.CONFIG_GET, key) as StoreValue;
		}
	},
	db: {
		set(key: DatabaseKey, value: string) {
			ipcRenderer.invoke(Channels.DATABASE_SET, [key, value]);
		},
		get(key: DatabaseKey): DatabaseValue {
			return ipcRenderer.sendSync(Channels.DATABASE_GET, key) as DatabaseValue;
		}
	},
	minimize() {
		ipcRenderer.invoke(Channels.WINDOW_CONTROLS, 'minimize');
	},
	maximize() {
		ipcRenderer.invoke(Channels.WINDOW_CONTROLS, 'maximize');
	},
	close() {
		ipcRenderer.invoke(Channels.WINDOW_CONTROLS, 'close');
	}
});
