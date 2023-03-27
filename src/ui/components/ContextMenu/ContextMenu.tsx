import { FC, ReactElement } from 'react';
import { Props } from './ContextMenuItem/ContextMenuItem';

import style from './ContextMenu.module.scss';

interface ContextMenuProps {
	children?: ReactElement<Props>[];
	x: number;
	y: number;
}

const ContextMenu: FC<ContextMenuProps> = (props) => {
	const { children, x, y } = props;
	return (
		<div style={{ top: y, left: x }} className={style['context-menu']}>
			<ul>{children}</ul>
		</div>
	);
};

export default ContextMenu;
