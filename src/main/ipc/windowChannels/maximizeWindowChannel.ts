/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { IpcMainEvent, BrowserWindow } from 'electron';
import { IpcChannel } from '../types';
import WindowChannels from '.';

class MaximizeWindowChannel implements IpcChannel<string, void> {
	getName(): string {
		return WindowChannels.MAXIMIZE_WINDOW;
	}

	handle(_event: IpcMainEvent, _args: string): void {
		const win = BrowserWindow.getFocusedWindow();

		if (!win) return;

		if (!win.isMaximized()) {
			win.maximize();
		} else {
			win.unmaximize();
		}
	}
}

export default MaximizeWindowChannel;
