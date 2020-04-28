import * as React from 'react';

require('./Player.scss');

const appleMusicIcon = '../../../../resources/icons/apple-music-white.png';
const previousIcon = '../../../../resources/icons/previous-track-white.png';
const playIcon = '../../../../resources/icons/play-white.png';
const nextIcon = '../../../../resources/icons/next-track-white.png';

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
