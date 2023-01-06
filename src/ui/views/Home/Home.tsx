import { FC } from 'react';
import View from '../../components/View/View';
import ContextMenuExample from '../../components/ContextMenu/ContextMenuExample';
import TabControl from '../../components/TabControl/TabControl';
import TabItem from '../../components/TabControl/TabItem/TabItem';
import HomeItemSmall from '../../components/Home_Elements/HomeItemSmall/HomeItemSmall';
import HomeItemMedium from '../../components/Home_Elements/HomeItemMedium/HomeItemMedium';

import './Home.scss';

import image1 from '../../../../assets/images/tune_no_artwork.svg';

const Home: FC = () => {
	return (
		<View title="Home" id="home">
			<div className="content">
				<TabControl>
					<TabItem label="Tab 1">
						<ContextMenuExample />
					</TabItem>
					<TabItem label="Tab 2">
						<HomeItemSmall image={image1} title="Awesome Album" artist="TUNE" />
						<HomeItemMedium image={image1} title="Awesome Album" artist="TUNE" />
					</TabItem>
				</TabControl>
			</div>
		</View>
	);
};

export default Home;
