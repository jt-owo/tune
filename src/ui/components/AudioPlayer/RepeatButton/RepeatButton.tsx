/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useState, useRef } from 'react';

import styles from './RepeatButton.module.scss';

import repeatIcon from '../../../../../assets/ui-icons/repeat.svg';
import oneIcon from '../../../../../assets/ui-icons/one-circle.svg';

const REPEAT_MODE = {
	OFF: 0,
	ONE: 1,
	ALL: 2
};

const RepeatButton = (): JSX.Element => {
	const [isRepeat, setIsRepeat] = useState(REPEAT_MODE.OFF);

	const repeatRef = useRef<HTMLDivElement>(null);

	const handleRepeat = () => {
		switch (isRepeat) {
			case REPEAT_MODE.OFF:
				setIsRepeat(REPEAT_MODE.ALL);
				repeatRef.current?.classList.toggle(styles.active);
				break;
			case REPEAT_MODE.ALL:
				setIsRepeat(REPEAT_MODE.ONE);
				repeatRef.current?.classList.toggle(styles.one);
				break;
			case REPEAT_MODE.ONE:
				setIsRepeat(REPEAT_MODE.OFF);
				repeatRef.current?.classList.toggle(styles.one);
				repeatRef.current?.classList.toggle(styles.active);
				break;

			default:
				break;
		}
	};

	return (
		<div className={styles['repeat-btn']} ref={repeatRef} onClick={handleRepeat}>
			<img src={repeatIcon} alt="" className={styles['repeat-btn-img']} />
			<img src={oneIcon} alt="" className={styles['repeat-btn-one']} />
			<div className={styles['repeat-btn-text']}>Repeat</div>
		</div>
	);
};

export default RepeatButton;
