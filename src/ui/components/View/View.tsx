import * as React from 'react';

import './View.scss';

interface ViewProps {
	title?: string;
	children?: JSX.Element | JSX.Element[];
}

const View: React.FC<ViewProps> = (props) => {
	const { title, children } = props;

	return (
		<div id="view">
			{title && (
				<>
					<div id="view-heading">{title}</div>
					<div id="divider" />
				</>
			)}
			<div className="view-content">{children}</div>
		</div>
	);
};

export default View;
