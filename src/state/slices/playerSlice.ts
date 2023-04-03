/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IPlaybackState, ITrack, IUser } from '../../typings/types';
import type { RootState } from '../store';

export interface PlayerState {
	/** Queue */
	queue: ITrack[];
	queueIndex: number;
	history: ITrack[];

	/** Playback info */
	currentTrack?: ITrack;
	isPlaying: boolean;
	isShuffle: boolean;
	isRepeat: boolean;
	volume: number;
	progress: number;

	/** Misc. */
	outputDeviceId?: string;
	spotifyToken?: string;
	user?: IUser; // FIXME: Move to seperate reducer.
}

const initialState: PlayerState = {
	queue: [],
	queueIndex: 0,
	history: [],
	isPlaying: false,
	isShuffle: false,
	isRepeat: false,
	volume: +window.api.config.get('volume'),
	progress: 0,
	outputDeviceId: window.api.config.get('outputDeviceId').toString()
};

export const playerSlice = createSlice({
	name: 'player',
	initialState,
	reducers: {
		updatePlaybackState: (state, action: PayloadAction<IPlaybackState>) => {
			state.currentTrack = action.payload.track;
			state.isPlaying = action.payload.isPlaying;
			state.isShuffle = action.payload.isShuffle;
			state.isRepeat = action.payload.repeatMode;
			state.volume = action.payload.volume / 1000;
			state.progress = action.payload.progress;
		},
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
		},
		updateUser: (state, action: PayloadAction<IUser>) => {
			state.user = action.payload;
		}
	}
});

export const { setTrack, setQueue, updateQueue, setOutputDevice, play, playNext, playPrevious, updateSpotifyToken, updateUser, updatePlaybackState } = playerSlice.actions;

export const selectQueue = (state: RootState) => state.player.queue;
export const selectQueueIndex = (state: RootState) => state.player.queueIndex;

export const selectIsPlaying = (state: RootState) => state.player.isPlaying;
export const selectIsShuffle = (state: RootState) => state.player.isShuffle;
export const selectIsRepeat = (state: RootState) => state.player.isRepeat;
export const selectCurrentTrack = (state: RootState) => state.player.currentTrack;
export const selectVolume = (state: RootState) => state.player.volume;
export const selectProgress = (state: RootState) => state.player.progress;

export const selectOutputDeviceId = (state: RootState) => state.player.outputDeviceId;
export const selectSpotifyToken = (state: RootState) => state.player.spotifyToken;
export const selectUser = (state: RootState) => state.player.user;

export default playerSlice.reducer;
