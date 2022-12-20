/* eslint-disable react/self-closing-comp */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/control-has-associated-label */
import * as React from 'react';
import View from '../../components/View/View';
import ContextMenuExample from '../../components/ContextMenu/ContextMenuExample';
import Dialog from '../../components/Dialog/Dialog';

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
