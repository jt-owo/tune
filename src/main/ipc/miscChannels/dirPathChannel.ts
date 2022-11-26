/* eslint-disable import/prefer-default-export */
/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { app } from 'electron';
import { IpcChannel } from '../types';
import MiscChannels from '.';

type ValidPaths = 'home' | 'appData' | 'userData' | 'cache' | 'temp' | 'exe' | 'module' | 'desktop' | 'documents' | 'downloads' | 'music' | 'pictures' | 'videos' | 'recent' | 'logs' | 'crashDumps';

class DirectoryPathChannel implements IpcChannel<ValidPaths, string> {
	getName(): string {
		return MiscChannels.GET_PATH;
	}

	handle(_event: Electron.IpcMainInvokeEvent, args: ValidPaths): string {
		return app.getPath(args) as string;
	}
}

export default DirectoryPathChannel;
