/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { dialog, IpcMainInvokeEvent } from 'electron';
import { IpcChannel } from '../types';
import Channels from '../channel';

class SelectFileChannel implements IpcChannel<string, string[]> {
	getName(): string {
		return Channels.SELECT_FILE;
	}

	async handle(_event: IpcMainInvokeEvent, _args: string): Promise<string[]> {
		const result = await dialog.showOpenDialog({
			properties: ['openFile', 'multiSelections'],
			filters: [{ name: 'Audio Files', extensions: ['mp3', 'flac'] }]
		});

		return result.filePaths;
	}
}

export default SelectFileChannel;
