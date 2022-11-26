/* eslint-disable jsx-a11y/media-has-caption */
import * as React from 'react';
import { createRef, useEffect, useState } from 'react';
import { selectCurrentTrack, selectOutputDeviceId, selectQueue, setTrack, updateQueue } from '../../../state/slices/playerSlice';
import { useAppDispatch, useAppSelector } from '../../hooks';

import './PlayerControls.scss';

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

		if (interval) clearTimeout(interval);
		interval = setInterval(seekUpdate, 1000);
		seekUpdate();

		if (audioRef.current && audioRef.current.paused) {
			audioRef.current.play();
			audioRef.current.volume = volume / 100;
		}

		if (!mounted) {
			mounted = true;
		}

		return () => {
			mounted = false;
			if (interval) clearInterval(interval);
		};
	}, [currentTrack, audioRef, volume, outputDeviceId]);

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

	return (
		<div id="player-container">
			<div id="player-controls-container">
				<img className="player-icon-service" alt="" />
				<div className="player-control-icon" />
				<div className="player-control-icon" />
				<div className="player-control-icon" />
				<input type="range" name="volumeSlider" className="volume-slider" min="0" max="100" value={volume} onChange={handleVolumeChange} />
				<div className="slider-container">
					<div className="current-time">{currentTime}</div>
					<input type="range" min="0" max="100" className="seek-slider" value={seekPosition} onChange={handleSeekTo} />
					<div className="total-duration">{totalDuration}</div>
				</div>
				{currentTrack?.fileName}
			</div>
			<audio src={currentTrack?.filePath} ref={audioRef} onEnded={onEnded} />
		</div>
	);
};

export default PlayerControls;
