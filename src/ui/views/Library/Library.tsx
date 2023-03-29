import { FC, useEffect, useState } from 'react';
import { useAppSelector } from '../../hooks';
import { selectSpotifyToken } from '../../../state/slices/playerSlice';
import SpotifyAPI from '../../util/spotifyAPI';

import View from '../../components/View/View';
import HomeItemSmall from '../../components/Home_Elements/HomeItemSmall/HomeItemSmall';

import style from './Library.module.scss';

const Library: FC = () => {
	const spotifyToken = useAppSelector(selectSpotifyToken);

	// FIXME: Add Spotify response types.
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [userAlbums, setUserAlbums] = useState<any[]>([]);

	useEffect(() => {
		const loadAlbums = async (accessToken: string) => {
			const data = await SpotifyAPI.fetchAlbums(accessToken);
			setUserAlbums(data.items);
		};

		if (spotifyToken) loadAlbums(spotifyToken);
	}, [spotifyToken]);

	return (
		<View title="Library" id="library">
			<div className={style.content}>
				{userAlbums &&
					userAlbums.map((item) => {
						return <HomeItemSmall key={item.album.name} title={item.album.name} image={item.album.images[0].url} artist={item.album.artists[0].name} />;
					})}
			</div>
		</View>
	);
};

export default Library;
