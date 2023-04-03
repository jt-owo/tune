import { configureStore } from '@reduxjs/toolkit';
import alertReducer from './slices/alertSlice';
import playlistsReducer from './slices/playlistSlice';
import playerReducer from './slices/playerSlice';

const store = configureStore({
	reducer: {
		player: playerReducer,
		alerts: alertReducer,
		playlists: playlistsReducer
	}
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
