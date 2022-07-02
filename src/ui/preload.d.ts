declare global {
	interface Window {
		electron: {
			ipc: {
				window: {
					minimize(): void;
					maximize(): void;
					close(): void;
				};
			};
		};
		process: {
			platform: string;
		};
	}
}

export {};
