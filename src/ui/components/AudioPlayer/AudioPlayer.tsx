import { FC, SyntheticEvent, useEffect, useRef, useCallback } from 'react';
import { play, playNext, playPrevious, selectCurrentTrack, selectIsPlaying, selectOutputDeviceId } from '../../../state/slices/playerSlice';
import { useAppDispatch, useAppSelector } from '../../hooks';

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

import style from './AudioPlayer.module.scss';

const AudioPlayer: FC = () => {
	const audioRef = useRef<HTMLAudioElement & { setSinkId(deviceId: string): void; volume: number }>(null);

	const currentTrack = useAppSelector(selectCurrentTrack);
	const isPlaying = useAppSelector(selectIsPlaying);
	const outputDeviceId = useAppSelector(selectOutputDeviceId);

	const dispatch = useAppDispatch();

	const handlePlayPause = useCallback(() => dispatch(play()), [dispatch]);

	const handlePlayNext = () => dispatch(playNext());

	const handlePlayPrev = () => dispatch(playPrevious());

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const onEnded = (_e: SyntheticEvent<HTMLAudioElement>) => handlePlayNext();

	useEffect(() => {
		if (audioRef.current && outputDeviceId) {
			audioRef.current.setSinkId(outputDeviceId);
		}
	}, [audioRef, outputDeviceId]);

	useEffect(() => {
		if (!audioRef.current) return;

		if (isPlaying) {
			audioRef.current.play().catch(() => {});
		} else {
			audioRef.current.pause();
		}
	}, [audioRef, isPlaying]);

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

		return () => {
			document.removeEventListener('keydown', () => {});
		};
	}, [handlePlayPause]);

	return (
		<div className={style['player-container']}>
			<div className={style['player-controls-container']}>
				<ServiceSelector />
				<div className={style['player-control-divider']} />
				{currentTrack && <NowPlaying track={currentTrack} onPlay={handlePlayPause} onNextTrack={handlePlayNext} onPreviousTrack={handlePlayPrev} />}
				<VolumeSlider audioRef={audioRef} />
				<SeekBar audioRef={audioRef} />
				<AudioControlButton id="skip-back-btn" onClick={handlePlayPrev} animationData={skipBackBtn} />
				<PlayPauseButton isPlaying={isPlaying} onClick={handlePlayPause} animationData={playBtn} />
				<AudioControlButton id="skip-forward-btn" onClick={handlePlayNext} animationData={skipForwardBtn} />
				<ShuffleButton />
				<RepeatButton />
			</div>
			{currentTrack?.service === 'local' && <audio src={currentTrack?.filePath} ref={audioRef} onEnded={onEnded} crossOrigin="anonymous" />}
		</div>
	);
};

export default AudioPlayer;
