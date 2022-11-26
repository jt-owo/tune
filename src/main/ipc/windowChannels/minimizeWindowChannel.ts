/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { IpcMainEvent, BrowserWindow } from 'electron';
import { IpcChannel } from '../types';
import WindowChannels from '.';

class MinimizeWindowChannel implements IpcChannel<string, void> {
	getName(): string {
		return WindowChannels.MINIMIZE_WINDOW;
	}

	handle(_event: IpcMainEvent, _args: string): void {
		const win = BrowserWindow.getFocusedWindow();

		if (!win) return;

		win.minimize();
	}
}

export default MinimizeWindowChannel;
