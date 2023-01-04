import { FC, useEffect, useRef, useState } from 'react';

interface SeekBarProps {
	audioRef: React.RefObject<HTMLAudioElement>;
}

const SeekBar: FC<SeekBarProps> = (props) => {
	const { audioRef } = props;

	const progressBarRef = useRef<HTMLDivElement>(null);

	const [seekPosition, setSeekPosition] = useState(0);
	const [currentTime, setCurrentTime] = useState('00:00');
	const [totalDuration, setTotalDuration] = useState('00:00');

	const handleSeekTo = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!audioRef.current || !audioRef.current.duration) return;

		const seekTo = parseInt(e.target.value, 10);
		audioRef.current.currentTime = audioRef.current.duration * (seekTo / 100);
		setSeekPosition(seekTo);
	};

	// Called on mouseEnter of Progress Bar
	const handleProgressBarEnter = () => {
		if (progressBarRef.current) {
			progressBarRef.current.style.opacity = '0.3';
		}
	};

	// Called on mouseLeave of Progress Bar
	const handleProgressBarLeave = () => {
		if (progressBarRef.current) {
			progressBarRef.current.style.opacity = '0.2';
		}
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

	return (
		<>
			<div id="duration-floater">
				{currentTime} / {totalDuration}
			</div>
			<div className="slider-container" onMouseEnter={handleProgressBarEnter} onMouseLeave={handleProgressBarLeave}>
				<div id="progress-bar" ref={progressBarRef} />
				<div className="current-time">{currentTime}</div>
				<input type="range" min="0" max="100" className="seek-slider" value={seekPosition} onChange={handleSeekTo} />
				<div className="total-duration">{totalDuration}</div>
			</div>
		</>
	);
};

export default SeekBar;
