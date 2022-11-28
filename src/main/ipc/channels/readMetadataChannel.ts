/* eslint-disable class-methods-use-this */
import { IpcMainInvokeEvent } from 'electron';
import { IpcChannel } from '../types';
import FileParser from '../../api/fileParser';
import Channels from '../channel';

class ReadMetadataChannel implements IpcChannel<string, string> {
	getName(): string {
		return Channels.READ_METADATA;
	}

	handle(_event: IpcMainInvokeEvent, args: string): Promise<string> {
		return FileParser.getMetadata(args);
	}
}

export default ReadMetadataChannel;
