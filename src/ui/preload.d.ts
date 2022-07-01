import { Channels } from 'main/preload';

declare global {
	interface Window {
		electron: {
			ipcRenderer: {
				sendMessage(channel: Channels, args: unknown[]): void;
				on(channel: string, func: (...args: unknown[]) => void): (() => void) | undefined;
				once(channel: string, func: (...args: unknown[]) => void): void;
			};
			mainWindow: {
				close(): void;
				maximize(): void;
				minimize(): void;
			};
		};
		process: {
			platform: string;
		};
	}
}

export {};
