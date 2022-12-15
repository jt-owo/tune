/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/media-has-caption */
import * as React from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import { createRef, useEffect, useState } from 'react';
import { selectCurrentTrack, selectOutputDeviceId, selectQueue, setTrack, updateQueue } from '../../../state/slices/playerSlice';
import { useAppDispatch, useAppSelector } from '../../hooks';

import './PlayerControls.scss';

import playBtn from '../../../../assets/animations/playPause.json';
import skipBackBtn from '../../../../assets/animations/skipBack.json';
import skipForwardBtn from '../../../../assets/animations/skipForward.json';

import tuneLogo from '../../../../assets/images/logo.png';

const PlayerControls: React.FC = () => {
	const audioRef = createRef<HTMLAudioElement & { setSinkId(deviceId: string): void }>();

	const currentTrack = useAppSelector(selectCurrentTrack);
	const queue = useAppSelector(selectQueue);
	const outputDeviceId = useAppSelector(selectOutputDeviceId);

	const [seekPosition, setSeekPosition] = useState(0);
	const [volume, setVolume] = useState(25);
	const [seekTo, setSeekTo] = useState(0);
	const [currentTime, setCurrentTime] = useState('00:00');
	const [totalDuration, setTotalDuration] = useState('00:00');

	const [isPlaying, setPlaying] = useState(false);

	const skipBackBtnRef = React.useRef<LottieRefCurrentProps>(null);
	const playBtnRef = React.useRef<LottieRefCurrentProps>(null);
	const skipForwardBtnRef = React.useRef<LottieRefCurrentProps>(null);

	const progressBarRef = createRef<HTMLDivElement>();

	const dispatch = useAppDispatch();

	useEffect(() => {
		let mounted = false;
		let interval: NodeJS.Timeout | null = null;

		if (audioRef.current && outputDeviceId) {
			audioRef.current.setSinkId(outputDeviceId);
		}

		const seekUpdate = () => {
			if (!audioRef.current) return;
			let seekPositionLocal = 0;

			if (audioRef.current.duration) {
				seekPositionLocal = audioRef.current.currentTime * (100 / audioRef.current.duration);
				setSeekPosition(seekPositionLocal);

				// Calculate the time left and the total duration
				let currentMinutes: number | string = Math.floor(audioRef.current.currentTime / 60);
				let currentSeconds: number | string = Math.floor(audioRef.current.currentTime - currentMinutes * 60);
				let durationMinutes: number | string = Math.floor(audioRef.current.duration / 60);
				let durationSeconds: number | string = Math.floor(audioRef.current.duration - durationMinutes * 60);

				// Add a zero to the single digit time values
				if (currentSeconds < 10) {
					currentSeconds = `0${currentSeconds}`;
				}
				if (durationSeconds < 10) {
					durationSeconds = `0${durationSeconds}`;
				}
				if (currentMinutes < 10) {
					currentMinutes = `0${currentMinutes}`;
				}
				if (durationMinutes < 10) {
					durationMinutes = `0${durationMinutes}`;
				}

				// Display the updated duration
				setCurrentTime(`${currentMinutes}:${currentSeconds}`);
				setTotalDuration(`${durationMinutes}:${durationSeconds}`);
			}
		};
		const updateProgressDiv = () => {
			if (progressBarRef.current && audioRef.current) {
				progressBarRef.current.style.right = `${(1 - audioRef.current.currentTime / audioRef.current.duration) * 100}%`;
			}
		};
		seekUpdate();
		updateProgressDiv();

		if (interval) clearTimeout(interval);
		interval = setInterval(seekUpdate, 1000);
		seekUpdate();

		if (audioRef.current && audioRef.current.paused) {
			audioRef.current.play().catch((error) => {
				console.log(`Promise rejected: ${error}`);
			});
			audioRef.current.volume = volume / 100;
		}

		if (!mounted) {
			mounted = true;
		}

		return () => {
			mounted = false;
			if (interval) clearInterval(interval);
		};
	}, [currentTrack, audioRef, volume, progressBarRef, outputDeviceId]);

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const onEnded = (_e: React.SyntheticEvent<HTMLAudioElement>) => {
		const queueCopy = [...queue];
		queueCopy.shift();
		if (queueCopy.length > 0) {
			dispatch(setTrack(queueCopy[0]));
			dispatch(updateQueue(queueCopy));
		}
	};

	const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setVolume(parseInt(e.target.value, 10));
		if (audioRef.current) {
			audioRef.current.volume = volume / 100;
		}
	};

	const handleSeekTo = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!audioRef.current || !audioRef.current.duration) return;

		setSeekTo(parseInt(e.target.value, 10));
		audioRef.current.currentTime = audioRef.current.duration * (seekTo / 100);
		setSeekPosition(seekTo);
	};

	useEffect(() => {
		playBtnRef?.current?.goToAndStop(7, true);
	}, []);

	// Handles Lottie Animations for the Player Controls
	const startAnimation = (ref: React.RefObject<LottieRefCurrentProps>) => {
		if (ref === playBtnRef) {
			ref?.current?.setSpeed(2);
			if (isPlaying) {
				ref?.current?.setDirection(1);
			} else {
				ref?.current?.setDirection(-1);
			}
			ref?.current?.play();
			setPlaying(!isPlaying);
		} else {
			ref?.current?.setSpeed(4);
			ref?.current?.stop();
			ref?.current?.play();
		}
	};

	// Called on mouseEnter of Progress Bar
	const handleProgressBarEnter = () => {
		if (progressBarRef.current) {
			progressBarRef.current.style.opacity = '0.25';
		}
	};

	// Called on mouseLeave of Progress Bar
	const handleProgressBarLeave = () => {
		if (progressBarRef.current) {
			progressBarRef.current.style.opacity = '0.15';
		}
	};

	const displayTrackTitle = () => {
		if (currentTrack?.metadata?.info?.title) {
			return currentTrack.metadata?.info?.title;
		}
		return 'No metadata found';
	};

	const displayTrackArtist = () => {
		if (currentTrack?.metadata?.info?.artist) {
			return currentTrack.metadata?.info?.artist;
		}
		return 'No metadata found';
	};

	return (
		<div id="player-container">
			<div id="duration-floater">
				{currentTime} / {totalDuration}
			</div>
			<div id="player-controls-container">
				<div id="service-selector">
					<img src={tuneLogo} alt="" draggable={false} />
				</div>
				<div id="player-control-divider" />
				<div id="track-info">
					<div id="current-track">{displayTrackTitle()}</div>
					<div id="current-artist">{displayTrackArtist()}</div>
				</div>
				<div id="progress-bar" ref={progressBarRef} />
				<input type="range" name="volumeSlider" className="volume-slider" min="0" max="100" value={volume} onChange={handleVolumeChange} />
				<div className="slider-container" onMouseEnter={handleProgressBarEnter} onMouseLeave={handleProgressBarLeave}>
					<input type="range" min="0" max="100" className="seek-slider" value={seekPosition} onChange={handleSeekTo} />
					<div className="total-duration">{totalDuration}</div>
				</div>
				<div className="player-control-container" onClick={() => startAnimation(skipBackBtnRef)}>
					<Lottie id="skip-back-btn" className="player-control-icon" animationData={skipBackBtn} loop={false} lottieRef={skipBackBtnRef} autoplay={false} />
				</div>
				<div className="player-control-container" onClick={() => startAnimation(playBtnRef)}>
					<Lottie id="play-btn" className="player-control-icon" animationData={playBtn} loop={false} lottieRef={playBtnRef} autoplay={false} />
				</div>
				<div className="player-control-container" onClick={() => startAnimation(skipForwardBtnRef)}>
					<Lottie id="skip-forward-btn" className="player-control-icon" animationData={skipForwardBtn} loop={false} lottieRef={skipForwardBtnRef} autoplay={false} />
				</div>
				{/* {currentTrack?.fileName} */}
			</div>

			<audio src={currentTrack?.filePath} ref={audioRef} onEnded={onEnded} crossOrigin="anonymous" />
		</div>
	);
};

export default PlayerControls;
