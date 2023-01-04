import { FC, useState } from 'react';
import useMousePosition from '../../hooks/useMousePosition';
import Portal from '../Portal/Portal';

import './ToolTip.scss';

interface ToolTipProps {
	/**
	 * Text the tooltip should displays.
	 */
	text: string;
	/**
	 * Number of the y offset which should be subtracted. Default value is 70.
	 */
	offsetY?: number;
	children: React.ReactNode | React.ReactNode[];
}

const ToolTip: FC<ToolTipProps> = (props) => {
	const { text, children, offsetY } = props;
	const [active, setActive] = useState(false);

	const mousePosition = useMousePosition();

	const mouseEnter = () => {
		setActive(true);
	};

	const mouseLeave = () => {
		setActive(false);
	};

	return (
		<div className="tooltip-container" onMouseEnter={mouseEnter} onMouseLeave={mouseLeave}>
			{children}
			{active && (
				<Portal wrapperID="tooltip-wrapper">
					<div style={{ left: mousePosition.x, top: mousePosition.y - (offsetY || 50) }} className="tooltip-text">
						{text}
					</div>
				</Portal>
			)}
		</div>
	);
};

export default ToolTip;
