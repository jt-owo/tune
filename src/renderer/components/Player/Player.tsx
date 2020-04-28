import * as React from 'react';

import appleMusicIcon from '../../../../resources/icons/apple-music-white.png';
import previousIcon from '../../../../resources/icons/previous-track-white.png';
import playIcon from '../../../../resources/icons/play-white.png';
import nextIcon from '../../../../resources/icons/next-track-white.png';

require('./Player.scss');

class Player extends React.Component {
    componentDidMount() {
        // TODO: Add player functionality
    }

    render() {
        return (
            <div id="audio-player-div">
                <div id="audio-player-controls">
                    <img
                        src={appleMusicIcon}
                        alt="appleMusicLogo"
                        className="player-icon-service"
                        />
                    <img src={nextIcon} alt="previousTrack" className="player-control-icons" />
                    <img src={playIcon} alt="play" className="player-control-icons" />
                    <img src={previousIcon} alt="nextTrack" className="player-control-icons" />
                </div>
            </div>
        );
    }
}

export default Player;
