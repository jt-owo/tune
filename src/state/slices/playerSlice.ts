/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IPlaybackState, ITrack, RepeatMode } from '../../typings/types';

export type PlayerState = {
	/** Queue */
	queue: ITrack[];
	queueIndex: number;
	history: ITrack[];

	/** Playback info */
	currentTrack?: ITrack;
	isPlaying: boolean;
	isShuffle: boolean;
	repeatMode: RepeatMode;
	volume: number;
	progress: number;

	/** Misc. */
	outputDeviceId?: string;
};

const initialState: PlayerState = {
	queue: [],
	queueIndex: 0,
	history: [],
	isPlaying: false,
	isShuffle: false,
	repeatMode: 'off',
	volume: 0,
	progress: 0
};

export const playerSlice = createSlice({
	name: 'player',
	initialState,
	reducers: {
		updatePlaybackState: (state, action: PayloadAction<IPlaybackState>) => {
			state.currentTrack = action.payload.track;
			state.isPlaying = action.payload.isPlaying;
			state.isShuffle = action.payload.isShuffle;
			state.repeatMode = action.payload.repeatMode;
			state.volume = action.payload.volume / 1000;
			state.progress = action.payload.progress;
		},
		setQueue: (state, action: PayloadAction<ITrack[]>) => {
			state.queue = action.payload;
			state.currentTrack = state.queue[state.queueIndex];
			state.isPlaying = true;
			state.queueIndex = 0;
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
		setOutputDevice: (state, action: PayloadAction<string>) => {
			state.outputDeviceId = action.payload;
			window.api?.config.set('outputDeviceId', JSON.stringify(action.payload));
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
		}
	}
});

export const { setQueue, updateQueue, setOutputDevice, play, playNext, playPrevious, updatePlaybackState } = playerSlice.actions;

export default playerSlice.reducer;
