import { FC, useEffect, useState } from 'react';
import { selectSpotifyToken, selectUser } from '../../../state/slices/playerSlice';
import { IArtist } from '../../../typings/types';
import { useAppSelector } from '../../hooks';
import SpotifyAPI from '../../util/spotifyAPI';

import View from '../../components/View/View';
import HomeItemMedium from '../../components/Home_Elements/HomeItemMedium/HomeItemMedium';

import style from './Home.module.scss';

const Home: FC = () => {
	const user = useAppSelector(selectUser);
	const spotifyToken = useAppSelector(selectSpotifyToken);

	const [topArtists, setTopArtists] = useState<IArtist[]>([]);

	const title = user ? `Hello, ${user.name}` : 'Home';

	useEffect(() => {
		const loadTopItems = async (accessToken: string) => {
			const artists = (await SpotifyAPI.fetchUserTopItems(accessToken, 'artists')) as IArtist[];
			setTopArtists(artists);
		};

		if (spotifyToken) {
			loadTopItems(spotifyToken);
		}
	}, [spotifyToken]);

	return (
		<View title={title} id="home">
			<div className={style.content}>
				{topArtists.length > 1 && (
					<div>
						<h3>You top artists</h3>
						<div className={style['top-artists']}>
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
