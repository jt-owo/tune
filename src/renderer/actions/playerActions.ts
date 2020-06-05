import { Action, ActionCreator } from 'redux';
import { SongObject } from '../components/Song/Song';

export const PLAY_PAUSE = 'PLAY_PAUSE';
export const ADD_TO_QUEUE = 'ADD_TO_QUEUE';

export interface PlayPauseAction extends Action {
    type: 'PLAY_PAUSE';
}

export interface AddToQueueAction extends Action {
    type: 'ADD_TO_QUEUE';
    song: SongObject;
}

export const playPause: ActionCreator<PlayPauseAction> = () => ({
    type: PLAY_PAUSE,
});

export const addToQueue: ActionCreator<AddToQueueAction> = (_song: SongObject) => ({
    type: ADD_TO_QUEUE,
    song: _song,
});

export type PlayerAction = PlayPauseAction | AddToQueueAction;
