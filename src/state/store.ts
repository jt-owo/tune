import { configureStore } from '@reduxjs/toolkit';
import alertReducer from './slices/alertSlice';
import playlistsReducer from './slices/playlistsSlice';
import playerReducer from './slices/playerSlice';
import userReducer from './slices/userSlice';

const store = configureStore({
	reducer: {
		player: playerReducer,
		alerts: alertReducer,
		playlists: playlistsReducer,
		user: userReducer
	}
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
