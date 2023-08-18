/* eslint-disable no-param-reassign */
import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import useMediaSession from '../../../hooks/useMediaSession';
import { playNext, playPrevious, togglePlay } from '../../../../state/slices/playerSlice';

import ControlButton from './ControlButton/ControlButton';
import PlayPauseButton from './PlayPauseButton/PlayPauseButton';

import playBtn from '../../../../../assets/animations/playPause.json';
import skipBackBtn from '../../../../../assets/animations/skipBack.json';
import skipForwardBtn from '../../../../../assets/animations/skipForward.json';

interface AudioControlsProps {
	audioRef: RefObject<TuneHTMLAudioElement>;
	seekBarRef: RefObject<HTMLInputElement>;
	setProgress: React.Dispatch<React.SetStateAction<number>>;
}

const AudioControls = ({ audioRef, seekBarRef, setProgress }: AudioControlsProps) => {
	const configVolume = window.api?.config.get('volume').toString() ?? '20';
	const [volume, setVolume] = useState(parseInt(configVolume, 10));

	const isPlaying = useAppSelector((state) => state.player.playback.isPlaying);
	const track = useAppSelector((state) => state.player.playback.track);

	const progressAnimationRef = useRef<number>();

	const dispatch = useAppDispatch();

	const repeat = useCallback(() => {
		if (!audioRef.current || !seekBarRef.current) return;

		const { currentTime, duration } = audioRef.current;
		setProgress(currentTime);
		const max = parseInt(seekBarRef.current.max, 10);
		seekBarRef.current.value = (currentTime * (max / duration)).toString();

		const rangeWidth = (currentTime / duration) * 100;
		seekBarRef.current.style.setProperty('--progress', `${rangeWidth}%`);

		progressAnimationRef.current = requestAnimationFrame(repeat);
	}, [audioRef, seekBarRef, setProgress]);

	const handlePlayPause = useCallback(() => {
		dispatch(togglePlay());
	}, [dispatch]);

	const handlePlayPrevious = () => {
		dispatch(playPrevious());
	};

	const handlePlayNext = () => {
		dispatch(playNext());
	};

	// Play / pause
	useEffect(() => {
		if (!audioRef.current) return;

		if (isPlaying) {
			audioRef.current.play();
			audioRef.current.volume = volume / 100;
		} else {
			audioRef.current.pause();
		}
		progressAnimationRef.current = requestAnimationFrame(repeat);
	}, [isPlaying, audioRef, repeat, volume, track?.id]);

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

	useEffect(() => {
		setVolume(parseInt(configVolume, 10));
	}, [configVolume]);

	useMediaSession({
		track,
		onPlay: handlePlayPause,
		onPause: handlePlayPause,
		onPreviousTrack: handlePlayPrevious,
		onNextTrack: handlePlayNext
	});

	return (
		<>
			<ControlButton id="skip-back-btn" onClick={handlePlayPrevious} animationData={skipBackBtn} />
			<PlayPauseButton isPlaying={isPlaying} onClick={handlePlayPause} animationData={playBtn} />
			<ControlButton id="skip-forward-btn" onClick={handlePlayNext} animationData={skipForwardBtn} />
		</>
	);
};

export default AudioControls;
