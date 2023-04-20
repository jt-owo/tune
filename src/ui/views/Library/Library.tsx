import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks';
import SpotifyAPI from '../../api/spotify';
import AppRoutes from '../../routes';
import { IAlbum, ITrack } from '../../../typings/types';
import Format from '../../util/format';

import View from '../../components/View/View';

import HomeItemSmall from '../../components/Home_Elements/HomeItemSmall/HomeItemSmall';
import TabControl from '../../components/TabControl/TabControl';
import TabItem from '../../components/TabControl/TabItem/TabItem';

import styles from './Library.module.scss';

const Library = (): JSX.Element => {
	const spotifyToken = useAppSelector((state) => state.user.spotifyToken);
	const spotifyPlaylists = useAppSelector((state) => state.playlists.spotify);

	const [savedAlbums, setSavedAlbums] = useState<IAlbum[]>([]);
	const [savedTracks, setSavedTracks] = useState<ITrack[]>([]);

	const navigate = useNavigate();

	const navigateToPlaylist = (id: string, service: string) => {
		navigate(`${AppRoutes.Playlist}/${id}/${service}`);
	};

	useEffect(() => {
		const loadAlbums = async (accessToken: string) => {
			const albums = await SpotifyAPI.fetchSavedAlbums(accessToken);
			setSavedAlbums(albums);
		};

		const loadTracks = async (accessToken: string) => {
			const tracks = await SpotifyAPI.fetchSavedTracks(accessToken);
			setSavedTracks(tracks);
		};

		if (spotifyToken) {
			loadAlbums(spotifyToken);
			loadTracks(spotifyToken);
		}
	}, [spotifyToken]);

	return (
		<View title="Library" id="library">
			<div className={styles.content}>
				<TabControl>
					<TabItem label="Playlists">
						<div>
							{spotifyPlaylists.length > 1 &&
								spotifyPlaylists.map((playlist) => {
									return (
										<HomeItemSmall
											key={playlist.name}
											title={playlist.name}
											image={playlist.images[0].url}
											artist={playlist.description}
											onClick={() => {
												navigateToPlaylist(playlist.id, playlist.service);
											}}
										/>
									);
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
									const { name, artists, image } = Format.getTrackFormatted(track);
									return <HomeItemSmall key={track.name} title={name} image={image} artist={artists} />;
								})}
						</div>
					</TabItem>
				</TabControl>
			</div>
		</View>
	);
};

export default Library;
