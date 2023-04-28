import { toggleShuffle } from '../../../../../state/slices/playerSlice';
import { useAppDispatch, useAppSelector } from '../../../../hooks';

import shuffleIcon from '../../../../../../assets/ui-icons/shuffle.svg';

import styles from './ShuffleButton.module.scss';

const ShuffleButton = (): JSX.Element => {
	const isShuffle = useAppSelector((state) => state.player.playback.isShuffle);

	const dispatch = useAppDispatch();

	const handleShuffle = () => dispatch(toggleShuffle());

	return (
		<div className={`${styles['shuffle-btn']} ${isShuffle ? styles.active : ''}`} onClick={handleShuffle}>
			<img src={shuffleIcon} alt="" className={styles['shuffle-btn-img']} />
			<div className={styles['shuffle-btn-text']}>Shuffle</div>
		</div>
	);
};

export default ShuffleButton;
