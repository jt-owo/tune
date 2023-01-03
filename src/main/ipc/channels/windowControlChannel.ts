/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BrowserWindow, IpcMainInvokeEvent } from 'electron';
import Channels from '../channel';
import { IpcChannel } from '../types';

class WindowControlChannel implements IpcChannel<string, void> {
	getName(): string {
		return Channels.WINDOW_CONTROLS;
	}

	handle(event: IpcMainInvokeEvent, args: string): void {
		const win = BrowserWindow.fromWebContents(event.sender);

		if (!win) return;

		switch (args) {
			case 'minimize':
				win.minimize();
				break;
			case 'maximize':
				if (!win.isMaximized()) {
					win.maximize();
				} else {
					win.unmaximize();
				}
				break;
			case 'close':
				win.close();
				break;
			default:
		}
	}
}

export default WindowControlChannel;
