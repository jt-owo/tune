/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { IpcMainInvokeEvent, shell } from 'electron';
import { IpcChannel } from '../types';
import Channels from '../channel';

class OpenUrlChannel implements IpcChannel<string, void> {
	getName(): string {
		return Channels.OPEN_URL;
	}

	async handle(_event: IpcMainInvokeEvent, _args: string): Promise<void> {
		shell.openExternal(_args);
	}
}

export default OpenUrlChannel;
