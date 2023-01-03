import * as React from 'react';
import View from '../../components/View/View';
import ContextMenuExample from '../../components/ContextMenu/ContextMenuExample';
import TabControl from '../../components/TabControl/TabControl';
import TabItem from '../../components/TabControl/TabItem';

import './Home.scss';

const Home: React.FC = () => {
	return (
		<View title="Home" id="home">
			<div className="content">
				<TabControl>
					<TabItem label="Tab1">
						<ContextMenuExample />
					</TabItem>
					<TabItem label="Tab2">
						<div>Tab 2 Content</div>
					</TabItem>
				</TabControl>
			</div>
		</View>
	);
};

export default Home;
