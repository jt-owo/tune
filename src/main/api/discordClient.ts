/* eslint-disable class-methods-use-this */
import DiscordRPC from 'discord-rpc';

export interface DiscordTrackData {
	name: string;
	artists: string;
	album: string;
}

class DiscordClient {
	private rpc?: DiscordRPC.Client;

	private track?: DiscordTrackData;

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

	setTrack(track: DiscordTrackData) {
		this.track = track;
	}

	// eslint-disable-next-line class-methods-use-this
	async setActivity() {
		if (!this.rpc || !this.track) return;

		const { name, artists, album } = this.track;

		let details = `${name}`;
		if (name?.toLowerCase() !== album?.toLowerCase()) {
			details = `${name} - ${album}`;
		}

		const startTimestamp = new Date();
		this.rpc.setActivity({
			details,
			state: `by ${artists}`,
			startTimestamp,
			largeImageKey: 'icon',
			largeImageText: 'tune.',
			instance: false
		});
	}
}

export default DiscordClient;
