import { FC } from 'react';
import View from '../../components/View/View';

import style from './Browse.module.scss';

const Browse: FC = () => {
	return (
		<View title="Browse" id="browse">
			<div className={style.content}> </div>
			<input type="text" className={style['text-input-3']} />
		</View>
	);
};

export default Browse;
