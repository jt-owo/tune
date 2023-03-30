import { ChangeEvent, FC, RefObject, useEffect, useRef, useState, useCallback } from 'react';

import audioPlayerStyle from '../AudioPlayer.module.scss';
import style from './SeekBar.module.scss';

interface SeekBarProps {
	audioRef: RefObject<HTMLAudioElement>;
}

const SeekBar: FC<SeekBarProps> = (props) => {
	const { audioRef } = props;

	const progressBarRef = useRef<HTMLDivElement>(null);
	const durationHoverRef = useRef<HTMLDivElement>(null);

	const [seekPosition, setSeekPosition] = useState(0);
	const [currentTime, setCurrentTime] = useState('00:00');
	const [totalDuration, setTotalDuration] = useState('00:00');

	const handleSeekTo = (e: ChangeEvent<HTMLInputElement>) => {
		if (!audioRef.current || !audioRef.current.duration) return;

		const seekTo = parseInt(e.target.value, 10);
		audioRef.current.currentTime = audioRef.current.duration * (seekTo / 100);
		setSeekPosition(seekTo);
	};

	const handleDurationOnHover = (show: boolean) => {
		if (durationHoverRef.current) {
			durationHoverRef.current.style.visibility = show ? 'visible' : 'hidden';
			durationHoverRef.current.style.opacity = show ? '1' : '0';
		}
	};

	const updateDurationFloaterPosition = useCallback(() => {
		if (durationHoverRef.current && audioRef.current) {
			const width = window.innerWidth;
			const left = (audioRef.current.currentTime / audioRef.current.duration) * width;
			const floaterWidth = durationHoverRef.current.offsetWidth;

			if (left < width - floaterWidth) {
				durationHoverRef.current.style.left = `${left}px`;
			}
		}
	}, [audioRef]);

	// Called on mouseEnter of Progress Bar
	const handleProgressBarEnter = () => {
		if (progressBarRef.current) {
			progressBarRef.current.style.opacity = '0.3';
		}
		handleDurationOnHover(true);
	};

	// Called on mouseLeave of Progress Bar
	const handleProgressBarLeave = () => {
		if (progressBarRef.current) {
			progressBarRef.current.style.opacity = '0.2';
		}
		handleDurationOnHover(false);
	};

	useEffect(() => {
		let interval: NodeJS.Timeout | null = null;

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

		return () => {
			if (interval) clearInterval(interval);
		};
	});

	useEffect(() => {
		if (durationHoverRef.current && audioRef.current) {
			const width = window.innerWidth;
			durationHoverRef.current.style.left = `${(audioRef.current.currentTime / audioRef.current.duration) * width}px`;
			updateDurationFloaterPosition();
		}
	}, [audioRef, audioRef.current?.currentTime, updateDurationFloaterPosition]);

	return (
		<>
			<div className={style['duration-floater']}>
				{currentTime} / {totalDuration}
			</div>
			<div className={style['duration-hover-floater']} ref={durationHoverRef}>
				{currentTime} / {totalDuration}
			</div>
			<div className={audioPlayerStyle['slider-container']} onMouseEnter={handleProgressBarEnter} onMouseLeave={handleProgressBarLeave}>
				<div className={style['progress-bar']} ref={progressBarRef} />
				<div className={style['current-time']}>{currentTime}</div>
				<input type="range" min="0" max="100" className={style['seek-slider']} value={seekPosition} onChange={handleSeekTo} />
				<div className={style['total-duration']}>{totalDuration}</div>
			</div>
		</>
	);
};

export default SeekBar;
