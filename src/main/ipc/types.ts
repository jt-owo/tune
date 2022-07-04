import { IpcMainEvent } from 'electron';

export interface IpcChannel {
	getName(): string;

	handle(event: IpcMainEvent, request: IpcRequest): void;
}

export interface IpcRequest {
	responseChannel?: string;
	params?: string[];
}
