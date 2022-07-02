/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */
import { IpcMainEvent, BrowserWindow } from 'electron';
import { IpcChannel, IpcRequest } from '../types';
import WindowChannels from '.';

class MinimizeWindowChannel implements IpcChannel {
	getName(): string {
		return WindowChannels.MINIMIZE_WINDOW;
	}

	handle(_event: IpcMainEvent, _request: IpcRequest): void {
		const win = BrowserWindow.getFocusedWindow();

		if (!win) return;

		win.minimize();
	}
}

export default MinimizeWindowChannel;
