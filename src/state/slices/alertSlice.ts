/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import newGuid from '../../ui/util';
import { IAlert } from '../../typings/types';

export type AlertState = {
	items: IAlert[];
};

const initialState: AlertState = {
	items: []
};

export const alertSlice = createSlice({
	name: 'alert',
	initialState,
	reducers: {
		addAlert: (state, action: PayloadAction<IAlert>) => {
			state.items.push({
				id: newGuid(),
				message: action.payload.message,
				type: action.payload.type
			});
		},
		removeAlert: (state, action: PayloadAction<string>) => {
			state.items = state.items.filter((alert) => {
				if (alert.id === action.payload) {
					return false;
				}
				return true;
			});
		}
	}
});

export const { addAlert, removeAlert } = alertSlice.actions;

export default alertSlice.reducer;
