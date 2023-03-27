import { FC } from 'react';

import style from './HomeItemMedium.module.scss';

interface HomeItemMediumProps {
	title: string;
	image: string;
	artist?: string;
	description?: string;
}

const HomeItemMedium: FC<HomeItemMediumProps> = (props) => {
	const { title, artist, image, description } = props;
	return (
		<div className={style['home-item-medium-container']}>
			<img src={image} alt="" draggable={false} className={style['home-item-medium-img']} />
			<div className={style['home-item-medium-info']}>
				<div className={style['home-item-medium-title']}>{title}</div>
				<div className={style['home-item-medium-description']}>{description}</div>
				<div className={style['home-item-medium-artist']}>{artist}</div>
			</div>
		</div>
	);
};

export default HomeItemMedium;
