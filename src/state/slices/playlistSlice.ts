/* eslint-disable promise/catch-or-return */
/* eslint-disable promise/always-return */
/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PlaylistData, TrackData } from '../../typings/playlist';
import newGuid from '../../ui/util';
import type { RootState } from '../store';

export interface PlaylistState {
	playlists: PlaylistData[];
}

const initialState: PlaylistState = {
	playlists: []
};

export const playlistSlice = createSlice({
	name: 'playlist',
	initialState,
	reducers: {
		addPlaylist: (state, action: PayloadAction<string>) => {
			const playlist: PlaylistData = {
				id: newGuid(),
				name: action.payload,
				tracks: [],
				pinned: true
			};

			state.playlists.push(playlist);

			window.tuneApi.db.set('playlists', JSON.stringify([...state.playlists]));
		},
		removePlaylist: (state, action: PayloadAction<string>) => {
			state.playlists = state.playlists.filter((playlist) => {
				if (playlist.id === action.payload) {
					return false;
				}
				return true;
			});

			window.tuneApi.db.set('playlists', JSON.stringify([...state.playlists]));
		},
		updatePlaylist: (state, action: PayloadAction<PlaylistData>) => {
			const toUpdate = state.playlists.find((p) => p.id === action.payload.id);
			if (!toUpdate) return;

			const index = state.playlists.indexOf(toUpdate);
			state.playlists[index] = action.payload;

			window.tuneApi.db.set('playlists', JSON.stringify([...state.playlists]));
		},
		loadPlaylists: (state) => {
			const stored = window.tuneApi.db.get('playlists') as PlaylistData[];
			state.playlists = stored;
		}
	}
});

export const { addPlaylist, removePlaylist, updatePlaylist, loadPlaylists } = playlistSlice.actions;

export const selectPlaylists = (state: RootState) => state.playlist.playlists;

export default playlistSlice.reducer;
