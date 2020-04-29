import { Action, ActionCreator } from 'redux';

export const PLAY_PAUSE = 'PLAY_PAUSE';

export interface PlayPauseAction extends Action {
    type: 'PLAY_PAUSE';
}

export const playPause: ActionCreator<PlayPauseAction> = () => ({
    type: PLAY_PAUSE,
});

export type PlayerAction = PlayPauseAction;
