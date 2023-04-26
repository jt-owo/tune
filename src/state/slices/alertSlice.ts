/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Guid from '../../util/guid';

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
				id: Guid.new(),
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
