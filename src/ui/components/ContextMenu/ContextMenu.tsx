import { FC } from 'react';

import style from './ContextMenu.module.scss';

interface ContextMenuProps {
	children?: JSX.Element | JSX.Element[];
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
