import React from 'react';
import { Props } from './ContextMenuItem/ContextMenuItem';

import './ContextMenu.scss';

interface ContextMenuProps {
	children?: React.ReactElement<Props>[];
	x: number;
	y: number;
}

const ContextMenu: React.FC<ContextMenuProps> = (props) => {
	const { children, x, y } = props;
	return (
		<div style={{ top: y, left: x }} id="context-menu">
			<ul>{children}</ul>
		</div>
	);
};

export default ContextMenu;
