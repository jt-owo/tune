import { FC } from 'react';
import RenameDialog from '../../components/RenameDialog/RenameDialog';
import View from '../../components/View/View';

import './Browse.scss';

const Browse: FC = () => {
	return (
		<View title="Browse" id="browse">
			<div className="content"> </div>
			<RenameDialog />
		</View>
	);
};

export default Browse;
