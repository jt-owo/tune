/* eslint-disable no-param-reassign */
import { RefObject, useCallback, useEffect, useRef } from 'react';
import Format from '../../../util/format';

import styles from './SeekBar.module.scss';

interface SeekBarProps {
	seekBarRef: RefObject<HTMLInputElement>;
	audioRef: RefObject<TuneHTMLAudioElement>;
	progress: number;
	duration: number;
}

const SeekBar = ({ seekBarRef, audioRef, progress, duration }: SeekBarProps) => {
	const floaterRef = useRef<HTMLDivElement>(null);

	const handleProgressChange = () => {
		if (!audioRef.current || !seekBarRef.current) return;
		const max = parseInt(seekBarRef.current.max, 10);
		audioRef.current.currentTime = audioRef.current.duration * (parseInt(seekBarRef.current.value, 10) / max);
	};

	const handleDurationOnHover = (show: boolean) => {
		if (!floaterRef.current) return;

		floaterRef.current.style.visibility = show ? 'visible' : 'hidden';
		floaterRef.current.style.opacity = show ? '1' : '0';
	};

	const updateDurationFloaterPosition = useCallback(() => {
		if (!floaterRef.current) return;

		const width = window.innerWidth;
		const left = (progress / duration) * width * 0.99 + 10; // 0.99 + 10 is to keep the floater centered over the drag handle while moving.
		const floaterWidth = floaterRef.current.offsetWidth;
		const clearance = 10; // Min distance the floater should stay away from the window borders in pixels.

		if (left < width - (floaterWidth / 2 + clearance) && left > floaterWidth / 2 + clearance) {
			floaterRef.current.style.left = `${left}px`;
		} else if (left < width - (floaterWidth / 2 + clearance)) {
			floaterRef.current.style.left = `${floaterWidth / 2 + clearance}px`;
		} else if (left > floaterWidth / 2 + clearance) {
			floaterRef.current.style.left = `${width - (floaterWidth / 2 + clearance)}px`;
		}
	}, [duration, progress]);

	const progressFormatted = Format.getDuration(progress);
	const durationFormatted = Format.getDuration(duration);

	useEffect(updateDurationFloaterPosition, [updateDurationFloaterPosition]);

	return (
		<>
			<div className={styles['duration-floater']}>
				{progressFormatted} / {durationFormatted}
			</div>
			{audioRef.current?.currentTime ? (
				<div className={styles['duration-hover-floater']} ref={floaterRef}>
					{progressFormatted} / {durationFormatted}
				</div>
			) : null}
			<div id="seek-bar-container">
				<input type="range" ref={seekBarRef} id={styles['seek-bar']} max={1000} onChange={handleProgressChange} onMouseEnter={() => handleDurationOnHover(true)} onMouseLeave={() => handleDurationOnHover(false)} />
			</div>
		</>
	);
};

export default SeekBar;
