import { Reducer } from 'redux';

import { PLAY_PAUSE, PlayerAction } from '../actions/playerActions';

export interface PlayerState {
    readonly status: string;
}

const defaultState: PlayerState = {
    status: 'paused',
};

export const playerReducer: Reducer<PlayerState> = (state = defaultState, action: PlayerAction) => {
    switch (action.type) {
        case PLAY_PAUSE:
            return {
                ...state,
                status: state.status === 'paused' ? 'playing' : 'paused',
            };
        default:
            return state;
    }
};
