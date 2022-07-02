/* eslint-disable import/prefer-default-export */
/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { IpcMainEvent, BrowserWindow } from 'electron';
import { IpcChannel, IpcRequest } from '../types';
import WindowChannels from '.';

class CloseWindowChannel implements IpcChannel {
	getName(): string {
		return WindowChannels.CLOSE_WINDOW;
	}

	handle(_event: IpcMainEvent, _request: IpcRequest): void {
		const win = BrowserWindow.getFocusedWindow();

		if (!win) return;

		win.close();
	}
}

export default CloseWindowChannel;
