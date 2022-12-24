import { contextBridge, ipcRenderer } from 'electron';
import { DatabaseKey, DatabaseValue } from './api/database';
import Channels from './ipc/channel';

contextBridge.exposeInMainWorld('ipc', {
	window: {
		minimize() {
			ipcRenderer.invoke(Channels.WINDOW_CONTROLS, 'minimize');
		},
		maximize() {
			ipcRenderer.invoke(Channels.WINDOW_CONTROLS, 'maximize');
		},
		close() {
			ipcRenderer.invoke(Channels.WINDOW_CONTROLS, 'close');
		}
	},
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
		}
	}
});

contextBridge.exposeInMainWorld('process', {
	platform: process.platform
});

contextBridge.exposeInMainWorld('tuneAPI', {
	db: {
		set(key: DatabaseKey, value: string) {
			ipcRenderer.invoke(Channels.DATABASE_SET, [key, value]);
		},
		get(key: DatabaseKey): DatabaseValue {
			return ipcRenderer.sendSync(Channels.DATABASE_GET, key) as DatabaseValue;
		}
	}
});
