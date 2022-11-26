/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { dialog } from 'electron';
import { IpcChannel } from '../types';
import MiscChannels from '.';

class AddTracksChannel implements IpcChannel<string, string[]> {
	getName(): string {
		return MiscChannels.ADD_TRACKS;
	}

	async handle(_event: Electron.IpcMainInvokeEvent, _args: string): Promise<string[]> {
		const result = await dialog.showOpenDialog({
			properties: ['openFile', 'multiSelections'],
			filters: [{ name: 'Audio Files', extensions: ['mp3', 'flac'] }]
		});

		return [...result.filePaths] as string[];
	}
}

export default AddTracksChannel;
