import styles from './HomeItemSmall.module.scss';

interface HomeItemSmallProps {
	title: string;
	artist: string;
	image: string;
	onClick?: (e: React.MouseEvent) => void;
}

const HomeItemSmall = ({ title, artist, image, onClick }: HomeItemSmallProps): JSX.Element => {
	return (
		<div className={styles['home-item-small-container']} onClick={onClick}>
			<img src={image} alt="" draggable={false} className={styles['home-item-small-img']} />
			<div className={styles['home-item-small-info']}>
				<div className={styles['home-item-small-title']}>{title}</div>
				<div className={styles['home-item-small-artist']}>{artist}</div>
			</div>
		</div>
	);
};

export default HomeItemSmall;
