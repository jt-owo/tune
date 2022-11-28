import { IpcMainInvokeEvent } from 'electron';

export interface IpcChannel<ArgsType, RetType> {
	getName(): string;

	handle(event: IpcMainInvokeEvent, args: ArgsType): RetType | Promise<RetType>;
}
