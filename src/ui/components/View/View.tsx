import * as React from 'react';

import './View.scss';

interface ViewProps {
	id: string;
	title?: string;
	children?: JSX.Element | JSX.Element[];
}

const View: React.FC<ViewProps> = (props) => {
	const { title, children, id } = props;

	return (
		<div id="view">
			{title && (
				<>
					<div id="view-heading">{title}</div>
					<div id="divider" />
				</>
			)}
			<div className="view-content">
				<div className={`${id}-container`}>{children}</div>
			</div>
		</div>
	);
};

export default View;
