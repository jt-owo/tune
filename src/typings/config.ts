import { IStoreData } from '../main/api/dynamicStore';
import { WindowBounds } from '../main/window/window';

export interface UserConfig extends IStoreData {
	windowBounds: WindowBounds;
	windowState: number;
	volume: number;
	outputDeviceId: string;
}
