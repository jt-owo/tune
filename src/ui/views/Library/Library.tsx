import * as React from 'react';

import View from '../../components/View/View';

import './Library.scss';

const Library: React.FC = () => {
	return (
		<div id="library-container">
			<View title="Library">
				<div className="content"> </div>
			</View>
		</div>
	);
};

export default Library;
