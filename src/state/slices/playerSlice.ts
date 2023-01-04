/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { TrackData } from '../../typings/playlist';

export interface PlayerState {
	queue: TrackData[];
	queueIndex: number;
	history: TrackData[];
	currentTrack?: TrackData;
	outputDeviceId?: string;
	isPlaying: boolean;
}

const initialState: PlayerState = {
	queue: [],
	queueIndex: 0,
	history: [],
	isPlaying: false,
	outputDeviceId: window.api.config.get('outputDeviceId') as string
};

export const playerSlice = createSlice({
	name: 'player',
	initialState,
	reducers: {
		setQueue: (state, action: PayloadAction<TrackData[]>) => {
			state.queue = action.payload;

			state.queueIndex = 0;
			state.currentTrack = state.queue[state.queueIndex];
			state.isPlaying = true;
		},
		updateQueue: (state, action: PayloadAction<TrackData[]>) => {
			state.queue = action.payload;
		},
		setTrack: (state, action: PayloadAction<TrackData>) => {
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
		}
	}
});

export const { setTrack, setQueue, updateQueue, setOutputDevice, play, playNext, playPrevious } = playerSlice.actions;

export const selectIsPlaying = (state: RootState) => state.player.isPlaying;
export const selectQueue = (state: RootState) => state.player.queue;
export const selectQueueIndex = (state: RootState) => state.player.queueIndex;
export const selectCurrentTrack = (state: RootState) => state.player.currentTrack;
export const selectOutputDeviceId = (state: RootState) => state.player.outputDeviceId;

export default playerSlice.reducer;
