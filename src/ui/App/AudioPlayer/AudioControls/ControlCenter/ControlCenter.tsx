import RepeatButton from '../RepeatButton/RepeatButton';
import ShuffleButton from '../ShuffleButton/ShuffleButton';
import VolumeSlider from '../VolumeSlider/VolumeSlider';
import styles from './ControlCenter.module.scss';

interface ControlCenterProps {
	audioRef: React.RefObject<TuneHTMLAudioElement>;
}

const ControlCenter = ({ audioRef }: ControlCenterProps): JSX.Element => {
	return (
		<div className={styles.container}>
			<div className={styles['button-container']}>
				<ShuffleButton />
				<RepeatButton />
			</div>
			<VolumeSlider audioRef={audioRef} />
		</div>
	);
};

export default ControlCenter;
