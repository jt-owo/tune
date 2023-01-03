import React from 'react';

import './HomeItemSmall.scss';

interface HomeItemSmallProps {
	title: string;
	artist: string;
	image: string;
}

const HomeItemSmall: React.FC<HomeItemSmallProps> = (props) => {
	const { title, artist, image } = props;
	return (
		<div id="home-item-small-container">
			<img src={image} alt="" draggable={false} id="home-item-small-img" />
			<div id="home-item-small-info">
				<div id="home-item-small-title">{title}</div>
				<div id="home-item-small-artist">{artist}</div>
			</div>
		</div>
	);
};

export default HomeItemSmall;
