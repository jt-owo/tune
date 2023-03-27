/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useState, useRef, FC } from 'react';

import style from './ShuffleButton.module.scss';

import shuffleIcon from '../../../../../assets/ui-icons/shuffle.svg';

const ShuffleButton: FC = () => {
	const [isShuffle, setIsShuffle] = useState(false);

	const shuffleRef = useRef<HTMLDivElement>(null);

	const handleShuffle = () => {
		setIsShuffle(!isShuffle);
		shuffleRef.current?.classList.toggle(style.active);
	};

	return (
		<div className={style['shuffle-btn']} ref={shuffleRef} onClick={handleShuffle}>
			<img src={shuffleIcon} alt="" className={style['shuffle-btn-img']} />
			<div className={style['shuffle-btn-text']}>Shuffle</div>
		</div>
	);
};

export default ShuffleButton;
