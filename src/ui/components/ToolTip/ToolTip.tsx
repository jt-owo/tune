import { ReactNode } from 'react';
import useMousePosition from '../../hooks/useMousePosition';
import useToggle from '../../hooks/useToggle';

import Portal from '../Portal/Portal';

import styles from './ToolTip.module.scss';

/** @const Amount of miliseconds until the fade in stars. */
const DELAY_UNTIL_FADE_IN_START = 500;

interface ToolTipProps {
	/**
	 * Text the tooltip should display.
	 */
	text: string;
	/**
	 * Number of the y offset which should be subtracted. Default value is 70.
	 */
	offsetY?: number;
	children: ReactNode;
}

const ToolTip = ({ text, children, offsetY }: ToolTipProps): JSX.Element => {
	const [active, toggleActive] = useToggle();
	const [fadeIn, toggleFadeIn] = useToggle();

	const mousePosition = useMousePosition();

	let timeout: NodeJS.Timeout;

	const mouseEnter = () => {
		timeout = setTimeout(() => {
			toggleFadeIn();
		}, DELAY_UNTIL_FADE_IN_START);
		toggleActive();
	};

	const mouseLeave = () => {
		toggleActive();
		toggleFadeIn();
		clearTimeout(timeout);
	};

	return (
		<div className={styles['tooltip-container']} onMouseEnter={mouseEnter} onMouseLeave={mouseLeave}>
			{children}
			{active && fadeIn && (
				<Portal wrapperID="tooltip-wrapper">
					<div style={{ left: mousePosition.x, top: mousePosition.y - (offsetY || 50) }} className={`${styles['tooltip-text']} ${fadeIn && styles.fadeIn}`}>
						{text}
					</div>
				</Portal>
			)}
		</div>
	);
};

export default ToolTip;
