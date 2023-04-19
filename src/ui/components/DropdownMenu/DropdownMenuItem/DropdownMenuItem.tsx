/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { FC } from 'react';

import style from './DropdownMenuItem.module.scss';

export interface DropdownMenuItemProps {
	label: string;
	value: string;
	selectCB?: (target: string) => void;
}

const DropdownMenuItem: FC<DropdownMenuItemProps> = (props) => {
	const { label, value, selectCB } = props;

	const handleSelect = () => {
		if (selectCB) selectCB(value);
	};

	return (
		<li className={style.container} onClick={handleSelect}>
			{label}
		</li>
	);
};

export default DropdownMenuItem;
