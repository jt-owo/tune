import styles from './HomeItemMedium.module.scss';

interface HomeItemMediumProps {
	title: string;
	image: string;
	artist?: string;
	description?: string;
}

const HomeItemMedium = ({ title, artist, image, description }: HomeItemMediumProps): JSX.Element => {
	return (
		<div className={styles['home-item-medium-container']}>
			<img src={image} alt="" draggable={false} className={styles['home-item-medium-img']} />
			<div className={styles['home-item-medium-info']}>
				<div className={styles['home-item-medium-title']}>{title}</div>
				<div className={styles['home-item-medium-description']}>{description}</div>
				<div className={styles['home-item-medium-artist']}>{artist}</div>
			</div>
		</div>
	);
};

export default HomeItemMedium;
