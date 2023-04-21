/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { toggleShuffle } from '../../../../state/slices/playerSlice';
import { useAppDispatch } from '../../../hooks';

import shuffleIcon from '../../../../../assets/ui-icons/shuffle.svg';

import styles from './ShuffleButton.module.scss';

interface ShuffleButtonProps {
	on: boolean;
}

const ShuffleButton = ({ on }: ShuffleButtonProps): JSX.Element => {
	const dispatch = useAppDispatch();

	const handleShuffle = () => {
		dispatch(toggleShuffle());
	};

	return (
		<div className={`${styles['shuffle-btn']} ${on ? 'active' : ''}`} onClick={handleShuffle}>
			<img src={shuffleIcon} alt="" className={styles['shuffle-btn-img']} />
			<div className={styles['shuffle-btn-text']}>Shuffle</div>
		</div>
	);
};

export default ShuffleButton;
