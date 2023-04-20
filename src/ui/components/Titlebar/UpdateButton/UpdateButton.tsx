import { useState } from 'react';

import styles from './UpdateButton.module.scss';

// Template for component which shows when an update is available and can be downloaded.

const UpdateButton = (): JSX.Element => {
	const [text, setText] = useState('tune.');

	return (
		<div className={styles['update-button']} onMouseEnter={() => setText('(^w^)')} onMouseLeave={() => setText('tune.')}>
			{text}
		</div>
	);
};

export default UpdateButton;
