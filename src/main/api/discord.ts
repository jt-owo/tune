/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-unresolved */
/* eslint-disable global-require */
import * as DiscordRPC from 'discord-rpc';
import * as dotenv from 'dotenv';
import { AudioMetadata } from '../../typings/playlist';

import FileParser from './fileParser';

dotenv.config();

class DiscordClient {
	private instance!: DiscordRPC.Client;

	private metadata: AudioMetadata | null = null;

	constructor() {
		const clientId = process.env.TUNE_DISCORD_CLIENT_ID;

		this.instance = new DiscordRPC.Client({ transport: 'ipc' });

		if (!clientId) return;

		// eslint-disable-next-line no-console
		this.instance.login({ clientId }).catch(console.error);

		this.instance.on('ready', () => {
			this.setActivity();

			setInterval(() => {
				this.setActivity();
			}, 15e3);
		});
	}

	public async updateTrack(trackPath: string) {
		this.metadata = JSON.parse(await FileParser.getMetadata(trackPath));
	}

	private setActivity = () => {
		if (this.metadata) {
			this.instance.setActivity({
				details: `${this.metadata?.info?.title}`,
				state: `by ${this.metadata?.info?.artist}`,
				largeImageKey: 'icon',
				instance: false
			});
		} else {
			this.instance.setActivity({
				details: 'PAUSED',
				largeImageKey: 'icon',
				instance: false
			});
		}
	};
}

export default DiscordClient;
