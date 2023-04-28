import { useRef, useState } from 'react';
import { useAppSelector } from '../../hooks';

import ServiceIcon from './ServiceIcon/ServiceIcon';
import NowPlaying from './NowPlaying/NowPlaying';
import AudioControls from './AudioControls/AudioControls';
import SeekBar from './SeekBar/SeekBar';

import styles from './AudioPlayer.module.scss';

const AudioPlayer = () => {
	const track = useAppSelector((state) => state.player.playback.track);
	const outputDeviceId = useAppSelector((state) => state.player.playback.outputDeviceId);

	const [progress, setProgress] = useState(0);
	const [duration, setDuration] = useState(0);

	const audioRef = useRef<TuneHTMLAudioElement>(null);
	const seekBarRef = useRef<HTMLInputElement>(null);

	return (
		<div className={styles['player-container']}>
			<div className={styles['player-controls-container']}>
				<ServiceIcon />
				<div className={styles['player-control-divider']} />
				{track && <NowPlaying track={track} audioRef={audioRef} seekBarRef={seekBarRef} setDuration={setDuration} outputDeviceId={outputDeviceId} />}
				<AudioControls audioRef={audioRef} seekBarRef={seekBarRef} setProgress={setProgress} />
				<SeekBar audioRef={audioRef} seekBarRef={seekBarRef} progress={progress} duration={duration} />
			</div>
		</div>
	);
};
export default AudioPlayer;
