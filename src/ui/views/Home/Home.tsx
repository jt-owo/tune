import { useEffect, useState } from 'react';
import { IArtist } from '../../../typings/types';
import { useAppSelector } from '../../hooks';
import SpotifyAPI from '../../api/spotify';

import View from '../../components/View/View';

import HomeItemMedium from '../../components/Home_Elements/HomeItemMedium/HomeItemMedium';

import styles from './Home.module.scss';

const Home = (): JSX.Element => {
	const user = useAppSelector((state) => state.user.data);
	const spotifyToken = useAppSelector((state) => state.user.spotifyToken);

	const [topArtists, setTopArtists] = useState<IArtist[]>([]);

	const title = user ? `Hello, ${user.name}` : 'Home';

	useEffect(() => {
		const loadTopItems = async (accessToken: string) => {
			const artists = (await SpotifyAPI.fetchUserTopItems(accessToken, 'artists')) as IArtist[];
			setTopArtists(artists);
		};

		if (spotifyToken) loadTopItems(spotifyToken);
	}, [spotifyToken]);

	return (
		<View title={title} id="home">
			<div className={styles.content}>
				{topArtists.length > 1 && (
					<div>
						<h3>You top artists</h3>
						<div className={styles['top-artists']}>
							{topArtists.map((artist) => {
								return <HomeItemMedium key={artist.name} title={artist.name} image={artist.images[0].url} />;
							})}
						</div>
					</div>
				)}
			</div>
		</View>
	);
};

export default Home;
