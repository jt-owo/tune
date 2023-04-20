import { ReactElement } from 'react';
import { ContextMenuItemProps } from './ContextMenuItem/ContextMenuItem';

import styles from './ContextMenu.module.scss';

interface ContextMenuProps {
	children?: ReactElement<ContextMenuItemProps>[];
	x: number;
	y: number;
}

const ContextMenu = ({ children, x, y }: ContextMenuProps): JSX.Element => {
	return (
		<div style={{ top: y, left: x }} className={styles['context-menu']}>
			<ul>{children}</ul>
		</div>
	);
};

export default ContextMenu;
