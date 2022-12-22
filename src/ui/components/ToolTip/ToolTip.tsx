import * as React from 'react';
import './ToolTip.scss';

interface ToolTipProps {
	text: string;
	children: React.ReactNode | React.ReactNode[];
}

const ToolTip: React.FC<ToolTipProps> = (props) => {
	const { text, children } = props;

	return (
		<div className="tooltip">
			{children}
			<span className="tooltip-text">{text}</span>
		</div>
	);
};

export default ToolTip;
