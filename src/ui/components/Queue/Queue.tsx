import * as React from 'react';

import './Queue.scss';

const Queue: React.FC = () => {
	return (
		<div id="queue-container">
			<header>Up Next</header>
			<div id="queue"> </div>
		</div>
	);
};

export default Queue;
