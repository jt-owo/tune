/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useState, useRef, FC } from 'react';

import './ShuffleButton.scss';

import shuffleIcon from '../../../../../assets/ui-icons/shuffle.svg';

const ShuffleButton: FC = () => {
	const [isShuffle, setIsShuffle] = useState(false);

	const shuffleRef = useRef<HTMLDivElement>(null);

	const handleShuffle = () => {
		setIsShuffle(!isShuffle);
		shuffleRef.current?.classList.toggle('active');
	};

	return (
		<div id="shuffle-btn" ref={shuffleRef} onClick={handleShuffle}>
			<img src={shuffleIcon} alt="" id="shuffle-btn-img" />
			<div id="shuffle-btn-text">Shuffle</div>
		</div>
	);
};

export default ShuffleButton;
