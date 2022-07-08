import { configureStore } from '@reduxjs/toolkit';
import alertReducer from './slices/alertSlice';
import playlistReducer from './slices/playlistSlice';

const store = configureStore({
	reducer: {
		alerts: alertReducer,
		playlist: playlistReducer
	}
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
