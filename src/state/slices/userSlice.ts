/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from '../../typings/types';

export type UserState = {
	data?: IUser;
	spotifyToken?: string;
};

const initialState: UserState = {};

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		updateUser: (state, action: PayloadAction<IUser>) => {
			state.data = action.payload;
		},
		updateSpotifyToken: (state, action: PayloadAction<string>) => {
			state.spotifyToken = action.payload;
		}
	}
});

export const { updateUser, updateSpotifyToken } = userSlice.actions;

export default userSlice.reducer;
