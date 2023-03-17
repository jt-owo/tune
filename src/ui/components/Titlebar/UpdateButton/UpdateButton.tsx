/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import { FC, useState } from 'react';

import style from './UpdateButton.module.scss';

// Template for component which shows when an update is available and can be downloaded.

const UpdateButton: FC = () => {
	const [text, setText] = useState('tune.');

	return (
		<div className={style['update-button']} onMouseEnter={() => setText('(^w^)')} onMouseLeave={() => setText('tune.')}>
			{text}
		</div>
	);
};

export default UpdateButton;
