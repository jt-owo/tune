/* eslint-disable class-methods-use-this */
import { IpcChannel } from '../types';
import MiscChannels from '.';
import FileParser from '../../api/fileParser';

type ValidPaths = 'home' | 'appData' | 'userData' | 'cache' | 'temp' | 'exe' | 'module' | 'desktop' | 'documents' | 'downloads' | 'music' | 'pictures' | 'videos' | 'recent' | 'logs' | 'crashDumps';

class ReadMetadataChannel implements IpcChannel<string, string> {
	getName(): string {
		return MiscChannels.GET_METADATA;
	}

	handle(_event: Electron.IpcMainInvokeEvent, args: ValidPaths): Promise<string> {
		return FileParser.getMetadata(args);
	}
}

export default ReadMetadataChannel;
