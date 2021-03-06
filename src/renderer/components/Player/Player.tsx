/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import * as React from 'react';

import './Player.scss';

import appleMusicIcon from '../../../../resources/icons/apple-music-white.png';
import previousIcon from '../../../../resources/icons/previous-track-white.png';
import playIcon from '../../../../resources/icons/play-white.png';
import nextIcon from '../../../../resources/icons/next-track-white.png';

export interface PlayerProps {
    playing: boolean;

    playPause: () => void;
}

const Player: React.FunctionComponent<PlayerProps> = ({ playPause }) => {
    return (
        <div id="player-container">
            <div id="player-controls-container">
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
