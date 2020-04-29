/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import * as React from 'react';

import './Player.scss';

import appleMusicIcon from '../../../../resources/icons/apple-music-white.png';
import previousIcon from '../../../../resources/icons/previous-track-white.png';
import playIcon from '../../../../resources/icons/play-white.png';
import nextIcon from '../../../../resources/icons/next-track-white.png';

export interface Props {
    status: string;

    playPause: () => any;
}

const Player: React.FunctionComponent<Props> = ({ playPause }) => {
    return (
        <div id="audio-player-div">
            <div id="audio-player-controls">
                <img src={appleMusicIcon} alt="appleMusicLogo" className="player-icon-service" />
                <img src={nextIcon} alt="previousTrack" className="player-control-icons" />
                <img
                    src={playIcon}
                    alt="play"
                    className="player-control-icons"
                    onClick={playPause}
                    />
                <img src={previousIcon} alt="nextTrack" className="player-control-icons" />
            </div>
        </div>
    );
};

export default Player;
