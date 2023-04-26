/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import TrackHelper from '../../ui/util/trackHelper';

export type PlayerState = {
	/** Queue */
	queue: ITrack[];
	index: number;
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
	index: 0,
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
		setQueue: (state, action: PayloadAction<ITrack[]>) => {
			state.queue = action.payload;
			state.index = 0;
			state.currentTrack = state.queue[state.index];
			state.isPlaying = true;
		},
		updateQueue: (state, action: PayloadAction<ITrack[]>) => {
			state.queue = action.payload;
		},
		addToQueueNext: (state, action: PayloadAction<ITrack>) => {
			const queue = [...state.queue];
			const id = TrackHelper.getNextID(queue);

			queue.splice(1, 0, {
				...action.payload,
				id
			});

			state.queue = queue;
		},
		addToQueueLast: (state, action: PayloadAction<ITrack>) => {
			const queue = [...state.queue];
			const id = TrackHelper.getNextID(queue);

			queue.push({
				...action.payload,
				id
			});

			state.queue = queue;
		},
		setOutputDevice: (state, action: PayloadAction<string>) => {
			state.outputDeviceId = action.payload;
			window.api?.config.set('outputDeviceId', JSON.stringify(action.payload));
		},
		play: (state) => {
			state.isPlaying = !state.isPlaying;
		},
		playNext: (state) => {
			const lastTrack = state.queue[state.index];
			if (state.index < state.queue.length) {
				state.index += 1;
				state.currentTrack = state.queue[state.index];
				state.isPlaying = true;
			}

			if (lastTrack) state.history.push(lastTrack);
		},
		playPrevious: (state) => {
			if (state.index !== 0 && state.index <= state.queue.length) {
				state.index -= 1;
				state.currentTrack = state.queue[state.index];
				state.isPlaying = true;
			}
		},
		toggleShuffle: (state) => {
			state.isShuffle = !state.isShuffle;
		}
	}
});

export const { setQueue, updateQueue, setOutputDevice, play, playNext, playPrevious, addToQueueNext, addToQueueLast, toggleShuffle } = playerSlice.actions;

export default playerSlice.reducer;
