import { FC, useEffect, useState } from 'react';
import { useAppSelector } from '../../hooks';
import { selectSpotifyToken } from '../../../state/slices/playerSlice';
import SpotifyAPI from '../../api/spotify';
import { IAlbum, IPlaylist, ITrack } from '../../../typings/types';

import View from '../../components/View/View';
import HomeItemSmall from '../../components/Home_Elements/HomeItemSmall/HomeItemSmall';
import TabControl from '../../components/TabControl/TabControl';
import TabItem from '../../components/TabControl/TabItem/TabItem';

import style from './Library.module.scss';

const Library: FC = () => {
	const spotifyToken = useAppSelector(selectSpotifyToken);

	const [savedAlbums, setSavedAlbums] = useState<IAlbum[]>([]);
	const [savedTracks, setSavedTracks] = useState<ITrack[]>([]);
	const [userPlaylists, setPlaylists] = useState<IPlaylist[]>([]);

	useEffect(() => {
		const loadAlbums = async (accessToken: string) => {
			const albums = await SpotifyAPI.fetchSavedAlbums(accessToken);
			setSavedAlbums(albums);
		};

		const loadTracks = async (accessToken: string) => {
			const tracks = await SpotifyAPI.fetchSavedTracks(accessToken);
			setSavedTracks(tracks);
		};

		const loadPlaylists = async (accessToken: string) => {
			const playlists = await SpotifyAPI.fetchUserPlaylists(accessToken);
			setPlaylists(playlists);
		};

		if (spotifyToken) {
			loadAlbums(spotifyToken);
			loadTracks(spotifyToken);
			loadPlaylists(spotifyToken);
		}
	}, [spotifyToken]);

	return (
		<View title="Library" id="library">
			<div className={style.content}>
				<TabControl>
					<TabItem label="Playlists">
						<div>
							{userPlaylists.length > 1 &&
								userPlaylists.map((playlist) => {
									return <HomeItemSmall key={playlist.name} title={playlist.name} image={playlist.images[0].url} artist={playlist.description} />;
								})}
						</div>
					</TabItem>
					<TabItem label="Liked Albums">
						<div>
							{savedAlbums.length > 1 &&
								savedAlbums.map((album) => {
									return <HomeItemSmall key={album.name} title={album.name} image={album.images[0].url} artist={album.artists[0].name} />;
								})}
						</div>
					</TabItem>
					<TabItem label="Liked Tracks">
						<div>
							{savedTracks.length > 1 &&
								savedTracks.map((track) => {
									return <HomeItemSmall key={track.name} title={track.name} image={track.album?.images[0].url ?? ''} artist={(track.artists && track.artists[0].name) ?? ''} />;
								})}
						</div>
					</TabItem>
				</TabControl>
			</div>
		</View>
	);
};

export default Library;
