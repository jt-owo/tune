/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import TrackHelper from '../../ui/util/trackHelper';

type PlayerState = {
	/** Contians all information about the queue */
	queue: IQueueState;

	/** Contains all information about playback, like volume or the current track. */
	playback: IPlaybackState;
};

const configVolume = window.api?.config.get('volume').toString();
const configOutputDevice = window.api?.config.get('outputDeviceId').toString();

const initialState: PlayerState = {
	queue: {
		tracks: [],
		history: [],
		index: 0
	},
	playback: {
		isPlaying: false,
		isShuffle: false,
		repeatMode: 'off',
		volume: configVolume ? parseInt(configVolume, 10) : 20,
		progress: 0,
		outputDeviceId: configOutputDevice ?? 'default'
	}
};

export const playerSlice = createSlice({
	name: 'player',
	initialState,
	reducers: {
		setQueue: (state, action: PayloadAction<ITrack[]>) => {
			state.queue = {
				tracks: action.payload,
				history: [...state.queue.history],
				index: 0
			};

			const track = state.queue.tracks[state.queue.index];

			state.playback = {
				...state.playback,
				track,
				isPlaying: true
			};
		},
		updateQueue: (state, action: PayloadAction<ITrack[]>) => {
			state.queue.tracks = action.payload;
		},
		addToQueueNext: (state, action: PayloadAction<ITrack>) => {
			const queue = [...state.queue.tracks];
			const id = TrackHelper.getNextID(queue);

			queue.splice(1, 0, {
				...action.payload,
				id
			});

			state.queue.tracks = queue;
		},
		addToQueueLast: (state, action: PayloadAction<ITrack>) => {
			const queue = [...state.queue.tracks];
			const id = TrackHelper.getNextID(queue);

			queue.push({
				...action.payload,
				id
			});

			state.queue.tracks = queue;
		},
		togglePlay: (state) => {
			state.playback.isPlaying = !state.playback.isPlaying;
		},
		playNext: (state) => {
			const lastTrack = state.queue.tracks[state.queue.index];
			if (state.queue.index < state.queue.tracks.length) {
				state.queue.index += 1;
				state.playback = {
					...state.playback,
					track: state.queue.tracks[state.queue.index],
					isPlaying: true
				};
			}

			if (lastTrack) state.queue.history.push(lastTrack);
		},
		playPrevious: (state) => {
			if (state.queue.index !== 0 && state.queue.index <= state.queue.tracks.length) {
				state.queue.index -= 1;
				state.playback = {
					...state.playback,
					track: state.queue.tracks[state.queue.index],
					isPlaying: true
				};
			}
		},
		toggleShuffle: (state) => {
			state.playback.isShuffle = !state.playback.isShuffle;
		},
		updateOutputDevice: (state, action: PayloadAction<string>) => {
			state.playback.outputDeviceId = action.payload;
			window.api?.config.set('outputDeviceId', JSON.stringify(action.payload));
		}
	}
});

export const { setQueue, updateQueue, addToQueueNext, addToQueueLast, togglePlay, playNext, playPrevious, toggleShuffle, updateOutputDevice } = playerSlice.actions;

export default playerSlice.reducer;
