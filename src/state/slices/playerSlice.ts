/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ITrack } from '../../typings/types';
import type { RootState } from '../store';

export interface PlayerState {
	queue: ITrack[];
	queueIndex: number;
	history: ITrack[];
	currentTrack?: ITrack;
	outputDeviceId?: string;
	isPlaying: boolean;
	spotifyToken?: string;
}

const initialState: PlayerState = {
	queue: [],
	queueIndex: 0,
	history: [],
	isPlaying: false,
	outputDeviceId: window.api.config.get('outputDeviceId').toString()
};

export const playerSlice = createSlice({
	name: 'player',
	initialState,
	reducers: {
		setQueue: (state, action: PayloadAction<ITrack[]>) => {
			state.queue = action.payload;

			state.queueIndex = 0;
			state.currentTrack = state.queue[state.queueIndex];
			state.isPlaying = true;
		},
		updateQueue: (state, action: PayloadAction<ITrack[]>) => {
			const fixedIds: ITrack[] = [];

			let id = 1;
			action.payload.forEach((track) => {
				fixedIds.push({
					...track,
					id
				});
				id += 1;
			});

			state.queue = fixedIds;
		},
		setTrack: (state, action: PayloadAction<ITrack>) => {
			state.currentTrack = action.payload;
			state.isPlaying = true;
		},
		setOutputDevice: (state, action: PayloadAction<string>) => {
			state.outputDeviceId = action.payload;
			window.api.config.set('outputDeviceId', JSON.stringify(action.payload));
		},
		play: (state) => {
			state.isPlaying = !state.isPlaying;
		},
		playNext: (state) => {
			const lastTrack = state.queue[state.queueIndex];
			if (state.queueIndex < state.queue.length) {
				state.queueIndex += 1;
				state.currentTrack = state.queue[state.queueIndex];
				state.isPlaying = true;
			}

			if (lastTrack) state.history = [...state.history, lastTrack];
		},
		playPrevious: (state) => {
			if (state.queueIndex !== 0 && state.queueIndex <= state.queue.length) {
				state.queueIndex -= 1;
				state.currentTrack = state.queue[state.queueIndex];
				state.isPlaying = true;
			}
		},
		updateSpotifyToken: (state, action: PayloadAction<string>) => {
			state.spotifyToken = action.payload;
		}
	}
});

export const { setTrack, setQueue, updateQueue, setOutputDevice, play, playNext, playPrevious, updateSpotifyToken } = playerSlice.actions;

export const selectIsPlaying = (state: RootState) => state.player.isPlaying;
export const selectQueue = (state: RootState) => state.player.queue;
export const selectQueueIndex = (state: RootState) => state.player.queueIndex;
export const selectCurrentTrack = (state: RootState) => state.player.currentTrack;
export const selectOutputDeviceId = (state: RootState) => state.player.outputDeviceId;
export const selectSpotifyToken = (state: RootState) => state.player.spotifyToken;

export default playerSlice.reducer;
