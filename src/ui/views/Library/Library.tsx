import { FC, useEffect, useState } from 'react';
import { useAppSelector } from '../../hooks';
import { selectSpotifyToken } from '../../../state/slices/playerSlice';
import SpotifyAPI from '../../util/spotifyAPI';
import { IAlbum, IArtist, ITrack } from '../../../typings/spotifyTypes';

import View from '../../components/View/View';
import HomeItemSmall from '../../components/Home_Elements/HomeItemSmall/HomeItemSmall';
import HomeItemMedium from '../../components/Home_Elements/HomeItemMedium/HomeItemMedium';
import TabControl from '../../components/TabControl/TabControl';
import TabItem from '../../components/TabControl/TabItem/TabItem';

import style from './Library.module.scss';

const Library: FC = () => {
	const spotifyToken = useAppSelector(selectSpotifyToken);

	const [savedAlbums, setSavedAlbums] = useState<IAlbum[]>([]);
	const [topArtists, setTopArtists] = useState<IArtist[]>([]);
	const [topTracks, setTopTracks] = useState<ITrack[]>([]);

	useEffect(() => {
		const loadAlbums = async (accessToken: string) => {
			const albums = await SpotifyAPI.fetchSavedAlbums(accessToken);
			setSavedAlbums(albums);
		};

		const loadTopItems = async (accessToken: string) => {
			const artists = (await SpotifyAPI.fetchUserTopItems(accessToken, 'artists')) as IArtist[];
			const tracks = (await SpotifyAPI.fetchUserTopItems(accessToken, 'tracks')) as ITrack[];

			setTopArtists(artists);
			setTopTracks(tracks);
		};

		if (spotifyToken) {
			loadAlbums(spotifyToken);
			loadTopItems(spotifyToken);
		}
	}, [spotifyToken]);

	return (
		<View title="Library" id="library">
			<div className={style.content}>
				<TabControl>
					<TabItem label="Saved Albums">
						<div>
							{savedAlbums.length > 1 &&
								savedAlbums.map((album) => {
									return <HomeItemSmall key={album.name} title={album.name} image={album.images[0].url} artist={album.artists[0].name} />;
								})}
						</div>
					</TabItem>
					<TabItem label="Top Artists">
						<div>
							{topArtists.length > 1 &&
								topArtists.map((artist) => {
									return <HomeItemMedium key={artist.name} title={artist.name} image={artist.images[0].url} />;
								})}
						</div>
					</TabItem>
					<TabItem label="Top Tracks">
						<div>
							{topTracks.length > 1 &&
								topTracks.map((track) => {
									return <HomeItemSmall key={track.name} title={track.name} image={track.album?.images[0].url ?? ''} artist={track.artists[0].name} />;
								})}
						</div>
					</TabItem>
				</TabControl>
			</div>
		</View>
	);
};

export default Library;
