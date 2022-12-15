/* eslint-disable jsx-a11y/media-has-caption */
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { play, playNext, playPrevious, selectCurrentTrack, selectIsPlaying, selectOutputDeviceId } from '../../../state/slices/playerSlice';
import { useAppDispatch, useAppSelector } from '../../hooks';

import './AudioPlayer.scss';

import playBtn from '../../../../assets/animations/playPause.json';
import skipBackBtn from '../../../../assets/animations/skipBack.json';
import skipForwardBtn from '../../../../assets/animations/skipForward.json';

import AudioControlButton from './AudioControlButton/AudioControlButton';
import PlayPauseButton from './PlayPauseButton/PlayPauseButton';
import SeekBar from './SeekBar/SeekBar';
import NowPlaying from './NowPlaying/NowPlaying';
import ServiceSelector from './ServiceSelector/ServiceSelector';

const AudioPlayer: React.FC = () => {
	const audioRef = useRef<HTMLAudioElement & { setSinkId(deviceId: string): void; volume: number }>(null);

	const currentTrack = useAppSelector(selectCurrentTrack);
	const isPlaying = useAppSelector(selectIsPlaying);
	const outputDeviceId = useAppSelector(selectOutputDeviceId);

	const [volume, setVolume] = useState(1);

	const dispatch = useAppDispatch();

	const handlePlayPause = () => {
		dispatch(play());
	};

	const handlePlayNext = () => {
		dispatch(playNext());
	};

	const handlePlayPrev = () => {
		dispatch(playPrevious());
	};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const onEnded = (_e: React.SyntheticEvent<HTMLAudioElement>) => {
		handlePlayNext();
	};

	const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setVolume(parseInt(e.target.value, 10));
	};

	useEffect(() => {
		if (audioRef.current) {
			audioRef.current.volume = volume / 100;
		}
	}, [audioRef, volume]);

	useEffect(() => {
		if (audioRef.current && outputDeviceId) {
			audioRef.current.setSinkId(outputDeviceId);
		}
	}, [audioRef, outputDeviceId]);

	useEffect(() => {
		if (!audioRef.current) return;

		if (isPlaying) {
			audioRef.current.play().catch(() => {
				// console.log(err);
			});
		} else {
			audioRef.current.pause();
		}
	}, [audioRef, isPlaying, currentTrack]);

	return (
		<div id="player-container">
			<div id="player-controls-container">
				<ServiceSelector />
				<div id="player-control-divider" />
				<NowPlaying track={currentTrack} />
				<input type="range" name="volumeSlider" className="volume-slider" min="0" max="100" value={volume} onChange={handleVolumeChange} />
				<SeekBar audioRef={audioRef} />
				<AudioControlButton id="skip-back-btn" onClick={handlePlayPrev} animationData={skipBackBtn} />
				<PlayPauseButton isPlaying={isPlaying} onClick={handlePlayPause} animationData={playBtn} />
				<AudioControlButton id="skip-forward-btn" onClick={handlePlayNext} animationData={skipForwardBtn} />
			</div>
			<audio src={currentTrack?.filePath} ref={audioRef} onEnded={onEnded} crossOrigin="anonymous" />
		</div>
	);
};

export default AudioPlayer;
