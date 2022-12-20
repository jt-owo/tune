import * as React from 'react';
import ContextMenuExample from '../../components/ContextMenu/ContextMenuExample';

import View from '../../components/View/View';
import './Home.scss';

const Home: React.FC = () => {
	return (
		<View title="Home" id="home">
			<div className="content">
				<ContextMenuExample />
			</div>
		</View>
	);
};

export default Home;
