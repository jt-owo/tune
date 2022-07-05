import * as React from 'react';

import './Playlist.scss';

import playIcon from '../../../../assets/ui-icons/simple-play-btn.svg';
import shuffleIcon from '../../../../assets/ui-icons/shuffle-svgrepo-com.svg';
import optionIcon from '../../../../assets/ui-icons/three-dots.svg';

import AlbumCover from '../../../../assets/images/AlbumCover.png';

const Playlist: React.FC = () => {
	return (
		<div id="playlist-container">
			<div id="playlist-heading">
				Test
				<div id="playlist-play-btn" className="playlist-heading-btn btn-hover-animation">
					<img id="play-icon" src={playIcon} alt="" draggable="false" />
				</div>
				<div id="playlist-shuffle-btn" className="playlist-heading-btn btn-hover-animation">
					<img id="shuffle-icon" src={shuffleIcon} alt="" draggable="false" />
				</div>
				<div id="playlist-option-btn" className="playlist-heading-btn btn-hover-animation">
					<img id="option-icon" src={optionIcon} alt="" draggable="false" />
				</div>
			</div>
			<div id="divider" />
			<div id="playlist-content">
				<ul>
					<li className="song-item btn-hover-animation">
						<img src={AlbumCover} alt="" />
						<div className="song-title">Cool Song</div>
					</li>
					<li className="song-item btn-hover-animation">
						<img src={AlbumCover} alt="" />
						<div className="song-title">Meh Song</div>
					</li>
				</ul>
			</div>
		</div>
	);
};

export default Playlist;
