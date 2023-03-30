/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PlaylistData } from '../../typings/playlist';
import { ITrack } from '../../typings/spotifyTypes';
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
			window.api.db.set('playlists', JSON.stringify([...state.playlists]));
		},
		removePlaylist: (state, action: PayloadAction<string>) => {
			state.playlists = state.playlists.filter((playlist) => {
				if (playlist.id === action.payload) {
					return false;
				}
				return true;
			});

			window.api.db.set('playlists', JSON.stringify([...state.playlists]));
		},
		updatePlaylist: (state, action: PayloadAction<PlaylistData>) => {
			const toUpdate = state.playlists.find((p) => p.id === action.payload.id);
			if (!toUpdate) return;

			const index = state.playlists.indexOf(toUpdate);
			state.playlists[index] = action.payload;

			const toSave = state.playlists.map((playlist) => {
				const tracks: ITrack[] = playlist.tracks.map((track) => {
					return {
						id: track.id,
						isLocal: track.isLocal,
						name: track.name
					};
				});

				return {
					...playlist,
					tracks
				};
			});

			window.api.db.set('playlists', JSON.stringify(toSave));
		},
		loadPlaylists: (state) => {
			const stored = window.api.db.get('playlists') as PlaylistData[];
			state.playlists = stored;
		}
	}
});

export const { addPlaylist, removePlaylist, updatePlaylist, loadPlaylists } = playlistSlice.actions;

export const selectPlaylists = (state: RootState) => state.playlist.playlists;

export default playlistSlice.reducer;
