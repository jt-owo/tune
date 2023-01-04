import { FC, useState } from 'react';
import useMousePosition from '../../hooks/useMousePosition';
import Portal from '../Portal/Portal';

import './ToolTip.scss';

// in ms
const DELAY_UNTIL_FADE_IN_START = 150;

interface ToolTipProps {
	/**
	 * Text the tooltip should displays.
	 */
	text: string;
	/**
	 * Number of the y offset which should be subtracted. Default value is 70.
	 */
	offsetY?: number;
	children: JSX.Element | JSX.Element[];
}

const ToolTip: FC<ToolTipProps> = (props) => {
	const { text, children, offsetY } = props;
	const [active, setActive] = useState(false);
	const [fadeIn, setFadeIn] = useState(false);

	const mousePosition = useMousePosition();

	let timeout: NodeJS.Timeout;

	const mouseEnter = () => {
		timeout = setTimeout(() => {
			setFadeIn(true);
		}, DELAY_UNTIL_FADE_IN_START);
		setActive(true);
	};

	const mouseLeave = () => {
		setActive(false);
		setFadeIn(false);
		clearTimeout(timeout);
	};

	return (
		<div className="tooltip-container" onMouseEnter={mouseEnter} onMouseLeave={mouseLeave}>
			{children}
			{active && (
				<Portal wrapperID="tooltip-wrapper">
					<div style={{ left: mousePosition.x, top: mousePosition.y - (offsetY || 50) }} className={`tooltip-text ${fadeIn && 'fadeIn'}`}>
						{text}
					</div>
				</Portal>
			)}
		</div>
	);
};

export default ToolTip;
