import { contextBridge, ipcRenderer } from 'electron';
import WindowChannels from './ipc/windowChannels';

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
		}
	}
});

contextBridge.exposeInMainWorld('process', {
	platform: process.platform
});
