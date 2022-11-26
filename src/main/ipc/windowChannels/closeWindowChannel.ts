/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { IpcMainEvent, BrowserWindow } from 'electron';
import { IpcChannel } from '../types';
import WindowChannels from '.';

class CloseWindowChannel implements IpcChannel<string, void> {
	getName(): string {
		return WindowChannels.CLOSE_WINDOW;
	}

	handle(_event: IpcMainEvent, _request: string): void {
		const win = BrowserWindow.getFocusedWindow();

		if (!win) return;

		win.close();
	}
}

export default CloseWindowChannel;
