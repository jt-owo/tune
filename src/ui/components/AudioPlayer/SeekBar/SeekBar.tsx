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
		audioRef.current.currentTime = audioRef.current.duration * (seekTo / 1000);
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
			const left = (audioRef.current.currentTime / audioRef.current.duration) * width * 0.98 + 10; // 0.98 + 10 is to keep the floater centered over the drag handle while moving
			const floaterWidth = durationHoverRef.current.offsetWidth;
			const clearance = 10; // min distance the floater should stay away from the window borders in pixels

			if (left < width - (floaterWidth / 2 + clearance) && left > floaterWidth / 2 + clearance) {
				durationHoverRef.current.style.left = `${left}px`;
			} else if (left < width - (floaterWidth / 2 + clearance)) {
				durationHoverRef.current.style.left = `${floaterWidth / 2 + clearance}px`;
			} else if (left > floaterWidth / 2 + clearance) {
				durationHoverRef.current.style.left = `${width - (floaterWidth / 2 + clearance)}px`;
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
				seekPositionLocal = audioRef.current.currentTime * (1000 / audioRef.current.duration);
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
		interval = setInterval(seekUpdate, 500);

		return () => {
			if (interval) clearInterval(interval);
		};
	});

	useEffect(() => {
		updateDurationFloaterPosition();
	}, [audioRef.current?.currentTime, updateDurationFloaterPosition]);

	return (
		<>
			<div className={style['duration-floater']}>
				{currentTime} / {totalDuration}
			</div>
			{audioRef.current?.currentTime ? (
				<div className={style['duration-hover-floater']} ref={durationHoverRef}>
					{currentTime} / {totalDuration}
				</div>
			) : null}
			<div className={audioPlayerStyle['slider-container']} onMouseEnter={handleProgressBarEnter} onMouseLeave={handleProgressBarLeave}>
				<div className={style['progress-bar']} ref={progressBarRef} />
				<div className={style['current-time']}>{currentTime}</div>
				<input type="range" min="0" max="1000" className={style['seek-slider']} value={seekPosition} onChange={handleSeekTo} />
				<div className={style['total-duration']}>{totalDuration}</div>
			</div>
		</>
	);
};

export default SeekBar;
