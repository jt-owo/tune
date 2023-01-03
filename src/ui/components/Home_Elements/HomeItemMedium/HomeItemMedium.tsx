import React from 'react';

import './HomeItemMedium.scss';

interface HomeItemMediumProps {
	title: string;
	image: string;
	artist?: string;
	description?: string;
}

const HomeItemMedium: React.FC<HomeItemMediumProps> = (props) => {
	const { title, artist, image, description } = props;
	return (
		<div id="home-item-medium-container">
			<img src={image} alt="" draggable={false} id="home-item-medium-img" />
			<div id="home-item-medium-info">
				<div id="home-item-medium-title">{title}</div>
				<div id="home-item-medium-description">{description}</div>
				<div id="home-item-medium-artist">{artist}</div>
			</div>
		</div>
	);
};

export default HomeItemMedium;
