import * as React from 'react';

import './PlayerControls.scss';

const PlayerControls: React.FC = () => {
	return (
		<div id="player-container">
			<div id="player-controls-container">
				<img className="player-icon-service" alt="" />
				<div className="player-control-icon" />
				<div className="player-control-icon" />
				<div className="player-control-icon" />
			</div>
		</div>
	);
};

export default PlayerControls;
