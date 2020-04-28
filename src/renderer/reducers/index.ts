import { combineReducers } from 'redux';

import { ExampleState, exampleReducer } from './exampleReducer';

export interface RootState {
    counter: ExampleState;
}

export const rootReducer = combineReducers<RootState | undefined>({
    counter: exampleReducer
});
