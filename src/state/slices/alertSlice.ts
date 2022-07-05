/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import newGuid from '../../ui/util';

export type AlertType = 'info' | 'error' | 'warn' | 'success';

export interface AlertData {
	id: string;
	message: string;
	type: AlertType;
}

// Define a type for the slice state
export interface AlertState {
	items: AlertData[];
}

// Define the initial state using that type
const initialState: AlertState = {
	items: []
};

export const alertSlice = createSlice({
	name: 'alert',
	initialState,
	reducers: {
		addAlert: (state, action: PayloadAction<AlertData>) => {
			if (!action.payload.id) {
				action.payload.id = newGuid();
			}

			state.items.push({
				id: action.payload.id,
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

// Action creators are generated for each case reducer function
export const { addAlert, removeAlert } = alertSlice.actions;

export const selectAlerts = (state: RootState) => state.alerts.items;

export default alertSlice.reducer;
