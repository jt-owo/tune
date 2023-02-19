import { FC } from 'react';

import style from './HamburgerMenuItem.module.scss';

interface HamburgerMenuItemProps {
	title: string;
	icon?: string;
}

export type Props = HamburgerMenuItemProps;

const HamburgerMenuItem: FC<HamburgerMenuItemProps> = (props) => {
	const { title, icon } = props;

	return (
		<div className={`${style.container}`}>
			<img src={icon} alt="" className={style.icon} />
			<div className={style.title}>{title}</div>
		</div>
	);
};

export default HamburgerMenuItem;
