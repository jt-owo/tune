/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Guid from '../../util/guid';

export type PlaylistsState = {
	/** Local playlists */
	local: IPlaylist[];
	/** Spotify playlists */
	spotify: IPlaylist[];
};

const initialState: PlaylistsState = {
	local: [],
	spotify: []
};

export const playlistsSlice = createSlice({
	name: 'playlists',
	initialState,
	reducers: {
		addPlaylist: (state, action: PayloadAction<string>) => {
			const playlist: IPlaylist = {
				id: Guid.new(),
				name: action.payload,
				description: '',
				tracks: [],
				images: [],
				pinned: true,
				locked: false,
				service: 'local'
			};

			state.local.push(playlist);
			window.api?.db.set('playlists', JSON.stringify([...state.local]));
		},
		deletePlaylist: (state, action: PayloadAction<string>) => {
			state.local = state.local.filter((playlist) => !(playlist.id === action.payload));

			window.api?.db.set('playlists', JSON.stringify([...state.local]));
		},
		updatePlaylist: (state, action: PayloadAction<IPlaylist>) => {
			const toUpdate = state.local.find((p) => p.id === action.payload.id);
			if (!toUpdate) return;

			const index = state.local.indexOf(toUpdate);
			state.local[index] = action.payload;

			const toSave = state.local.map((playlist) => {
				const tracks: ITrack[] = playlist.tracks.map((track) => {
					return {
						id: track.id,
						filePath: track.filePath,
						service: track.service
					};
				});

				return {
					...playlist,
					tracks
				};
			});

			window.api?.db.set('playlists', JSON.stringify(toSave));
		},
		loadPlaylists: (state) => {
			if (window.api) {
				const stored = window.api?.db.get('playlists') as IPlaylist[];
				state.local = stored;
			}
		},
		loadSpotifyPlaylists: (state, action: PayloadAction<IPlaylist[]>) => {
			state.spotify = action.payload;
		}
	}
});

export const { addPlaylist, deletePlaylist, updatePlaylist, loadPlaylists, loadSpotifyPlaylists } = playlistsSlice.actions;

export default playlistsSlice.reducer;
