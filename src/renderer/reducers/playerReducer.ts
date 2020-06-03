import { Reducer } from 'redux';

import { PLAY_PAUSE, PlayerAction } from '../actions/playerActions';

export interface PlayerState {
    readonly playing: boolean;
}

const defaultState: PlayerState = {
    playing: false,
};

export const playerReducer: Reducer<PlayerState> = (state = defaultState, action: PlayerAction) => {
    switch (action.type) {
        case PLAY_PAUSE:
            return {
                ...state,
                playing: !state.playing,
            };
        default:
            return state;
    }
};
