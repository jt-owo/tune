import { FC } from 'react';

import style from './HomeItemSmall.module.scss';

interface HomeItemSmallProps {
	title: string;
	artist: string;
	image: string;
}

const HomeItemSmall: FC<HomeItemSmallProps> = (props) => {
	const { title, artist, image } = props;
	return (
		<div className={style['home-item-small-container']}>
			<img src={image} alt="" draggable={false} className={style['home-item-small-img']} />
			<div className={style['home-item-small-info']}>
				<div className={style['home-item-small-title']}>{title}</div>
				<div className={style['home-item-small-artist']}>{artist}</div>
			</div>
		</div>
	);
};

export default HomeItemSmall;
