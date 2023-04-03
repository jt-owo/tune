import DiscordRPC from 'discord-rpc';

class DiscordClient {
	private rpc?: DiscordRPC.Client;

	constructor(clientId: string) {
		this.rpc = new DiscordRPC.Client({ transport: 'ipc' });

		this.rpc.on('ready', () => {
			this.setActivity();

			// Activity can only be set every 15 seconds.
			setInterval(() => {
				this.setActivity();
			}, 15e3);
		});

		// eslint-disable-next-line no-console
		this.rpc.login({ clientId }).catch(console.error);
	}

	// eslint-disable-next-line class-methods-use-this
	async setActivity() {
		if (!this.rpc) return;

		const startTimestamp = new Date();
		this.rpc.setActivity({
			details: `Test`,
			state: 'Test2',
			startTimestamp,
			largeImageKey: 'icon',
			largeImageText: 'tune.',
			instance: false
		});
	}
}

export default DiscordClient;
