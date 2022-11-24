import { IpcMainEvent, IpcMainInvokeEvent } from 'electron';

export interface IpcChannel {
	getName(): string;

	handle(event: IpcMainEvent | IpcMainInvokeEvent, request: IpcRequest): void;
}

export interface IpcRequest {
	responseChannel?: string;
	params?: string[];
}
