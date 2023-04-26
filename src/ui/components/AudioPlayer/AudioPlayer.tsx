import { SyntheticEvent, useEffect, useRef, useCallback } from 'react';
import { togglePlay, playNext, playPrevious } from '../../../state/slices/playerSlice';
import { useAppDispatch, useAppSelector } from '../../hooks';
import Format from '../../util/format';

import AudioControlButton from './AudioControlButton/AudioControlButton';
import PlayPauseButton from './PlayPauseButton/PlayPauseButton';
import SeekBar from './SeekBar/SeekBar';
import NowPlaying from './NowPlaying/NowPlaying';
import ServiceSelector from './ServiceSelector/ServiceSelector';
import VolumeSlider from './VolumeSlider/VolumeSlider';
import ShuffleButton from './ShuffleButton/ShuffleButton';
import RepeatButton from './RepeatButton/RepeatButton';

import playBtn from '../../../../assets/animations/playPause.json';
import skipBackBtn from '../../../../assets/animations/skipBack.json';
import skipForwardBtn from '../../../../assets/animations/skipForward.json';

import styles from './AudioPlayer.module.scss';

interface TuneHTMLAudioElement extends HTMLAudioElement {
	setSinkId(deviceId: string): void;
	volume: number;
}

const AudioPlayer = (): JSX.Element => {
	const audioRef = useRef<TuneHTMLAudioElement>(null);

	const playback = useAppSelector((state) => state.player.playback);

	const dispatch = useAppDispatch();

	const handlePlayPause = useCallback(() => dispatch(togglePlay()), [dispatch]);

	const handlePlayNext = () => dispatch(playNext());

	const handlePlayPrev = () => dispatch(playPrevious());

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const onEnded = (_e: SyntheticEvent<HTMLAudioElement>) => handlePlayNext();

	useEffect(() => {
		if (audioRef.current && playback.outputDeviceId) audioRef.current.setSinkId(playback.outputDeviceId);
	}, [audioRef, playback.outputDeviceId]);

	useEffect(() => {
		if (!audioRef.current || !playback.track) return;

		if (playback.isPlaying) {
			// eslint-disable-next-line no-console
			audioRef.current.play().catch(console.error);
			audioRef.current.volume = playback.volume / 100;
		} else {
			audioRef.current.pause();
		}
	}, [audioRef, playback.isPlaying, playback.track, playback.volume]);

	// Adds keyboard shortcuts for play/pause. Maybe more in the future?
	useEffect(() => {
		// Spacebar for play/pause.
		document.addEventListener('keydown', (e) => {
			if (e.code === 'Space') {
				// Don't trigger if the user is typing in a text field.
				if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

				e.preventDefault();
				handlePlayPause();
			}
		});

		return () => document.removeEventListener('keydown', () => {});
	}, [handlePlayPause]);

	return (
		<div className={styles['player-container']}>
			<div className={styles['player-controls-container']}>
				<ServiceSelector />
				<div className={styles['player-control-divider']} />
				{playback.track && <NowPlaying track={playback.track} onPlay={handlePlayPause} onNextTrack={handlePlayNext} onPreviousTrack={handlePlayPrev} />}
				<VolumeSlider audioRef={audioRef} />
				<SeekBar audioRef={audioRef} />
				<AudioControlButton id="skip-back-btn" onClick={handlePlayPrev} animationData={skipBackBtn} />
				<PlayPauseButton isPlaying={playback.isPlaying} onClick={handlePlayPause} animationData={playBtn} />
				<AudioControlButton id="skip-forward-btn" onClick={handlePlayNext} animationData={skipForwardBtn} />
				<ShuffleButton on={playback.isShuffle} />
				<RepeatButton />
			</div>
			{playback.track?.service === 'local' && playback.track.filePath && <audio src={Format.getFilePath(playback.track.filePath)} ref={audioRef} onEnded={onEnded} crossOrigin="anonymous" />}
		</div>
	);
};

export default AudioPlayer;
