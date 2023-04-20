/* eslint-disable class-methods-use-this */
import { IpcMainInvokeEvent } from 'electron';
import { IpcChannel } from '../types';
import FileParser from '../../util/fileParser';
import Channels from '../channel';

class LoadMetadataChannel implements IpcChannel<string, string> {
	getName(): string {
		return Channels.LOAD_METADATA;
	}

	handle(_event: IpcMainInvokeEvent, args: string): Promise<string> {
		return FileParser.loadMetadata(args);
	}
}

export default LoadMetadataChannel;
