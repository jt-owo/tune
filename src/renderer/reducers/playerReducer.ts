import { Reducer } from 'redux';

import { SongObject } from '../components/Song/Song';

import { PLAY_PAUSE, ADD_TO_QUEUE, PlayerAction } from '../actions/playerActions';

export interface PlayerState {
    readonly playing: boolean;
    readonly queue: Array<SongObject>;
}

const defaultState: PlayerState = {
    playing: false,
    queue: [],
};

export const playerReducer: Reducer<PlayerState> = (state = defaultState, action: PlayerAction) => {
    switch (action.type) {
        case PLAY_PAUSE:
            return {
                ...state,
                playing: !state.playing,
            };
        case ADD_TO_QUEUE:
            state.queue.push(action.song);
            return {
                ...state,
                queue: state.queue,
            };
        default:
            return state;
    }
};
