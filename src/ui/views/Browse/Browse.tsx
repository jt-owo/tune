import { FC } from 'react';
import View from '../../components/View/View';

import './Browse.scss';

const Browse: FC = () => {
	return (
		<View title="Browse" id="browse">
			<div className="content"> </div>
			<input type="text" className="text-input-3" />
		</View>
	);
};

export default Browse;
