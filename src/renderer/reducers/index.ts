import { combineReducers } from 'redux';

import { ExampleState, exampleReducer } from './exampleReducer';
import { PlayerState, playerReducer } from './playerReducer';

export interface RootState {
    counter: ExampleState;
    player: PlayerState;
}

export const rootReducer = combineReducers<RootState | undefined>({
    counter: exampleReducer,
    player: playerReducer,
});
