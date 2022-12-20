import React from 'react';
import { ContextMenuItemProps } from './ContextMenuItem/ContextMenuItem';

interface ContextMenuProps {
	children?: React.ReactElement<ContextMenuItemProps>[];
	x: number;
	y: number;
}

const ContextMenu: React.FC<ContextMenuProps> = (props) => {
	const { children, x, y } = props;
	return (
		<div style={{ top: y, left: x }}>
			<ul>{children}</ul>
		</div>
	);
};

export default ContextMenu;
