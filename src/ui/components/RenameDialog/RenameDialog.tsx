/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable react/button-has-type */
import { FC } from 'react';

import style from './RenameDialog.module.scss';

const RenameDialog: FC = () => {
	return (
		<div className={style['dialog']}>
			<input type="text" placeholder="Playlist name" />
			<div className={style['button-container']}>
				<button className={style['confirm-btn']}>Rename</button>
				<button className={style['cancel-btn']}>Cancel</button>
			</div>
		</div>
	);
};

export default RenameDialog;
