import { contextBridge, ipcRenderer } from 'electron';
import { DatabaseKey, DatabaseValue } from './library';
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
		async loadMetadata(trackJSON: string) {
			const trackMD = await ipcRenderer.invoke(Channels.LOAD_METADATA, trackJSON);

			return trackMD.toString();
		},
		openURL(url: string) {
			ipcRenderer.invoke(Channels.OPEN_URL, url);
		},
		setTrack(name: string, artists: string, album: string) {
			ipcRenderer.invoke(Channels.SET_TRACK, [name, artists, album]);
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
