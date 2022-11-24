/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { TrackData } from '../../typings/playlist';

export interface PlayerState {
	queue: TrackData[];
	currentTrack?: TrackData;
}

const initialState: PlayerState = {
	queue: []
};

export const playerSlice = createSlice({
	name: 'player',
	initialState,
	reducers: {
		addToQueue: (state, action: PayloadAction<TrackData[]>) => {
			const wasEmpty = state.queue.length < 1;

			state.queue = [...state.queue, ...action.payload];

			if (wasEmpty) {
				state.currentTrack = state.queue[0];
			}
		},
		setQueue: (state, action: PayloadAction<TrackData[]>) => {
			const wasEmpty = state.queue.length < 1;

			state.queue = action.payload;

			state.currentTrack = state.queue[0];
		},
		updateQueue: (state, action: PayloadAction<TrackData[]>) => {
			state.queue = action.payload;
		},
		setTrack: (state, action: PayloadAction<TrackData>) => {
			state.currentTrack = action.payload;
		}
	}
});

export const { addToQueue, setTrack, setQueue, updateQueue } = playerSlice.actions;

export const selectQueue = (state: RootState) => state.player.queue;
export const selectCurrentTrack = (state: RootState) => state.player.currentTrack;

export default playerSlice.reducer;
