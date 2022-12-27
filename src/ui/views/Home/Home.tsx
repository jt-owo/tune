/* eslint-disable react/self-closing-comp */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/control-has-associated-label */
import * as React from 'react';
import View from '../../components/View/View';
import ContextMenuExample from '../../components/ContextMenu/ContextMenuExample';
import HomeItemSmall from '../../components/Home_Elements/HomeItemSmall/HomeItemSmall';
import HomeItemMedium from '../../components/Home_Elements/HomeItemMedium/HomeItemMedium';

import './Home.scss';

import image1 from '../../../../assets/images/tune_no_artwork.svg';

const Home: React.FC = () => {
	return (
		<View title="Home" id="home">
			<div className="content">
				<ContextMenuExample />
				<HomeItemSmall image={image1} title="Awesome Album" artist="TUNE" />
				<HomeItemMedium image={image1} title="Awesome Album" artist="TUNE" />
			</div>
		</View>
	);
};

export default Home;
