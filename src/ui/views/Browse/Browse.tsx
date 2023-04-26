import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { addAlert } from '../../../state/slices/alertSlice';
import SpotifyAPI from '../../api/spotify';

import View from '../../components/View/View';

import TextBox from '../../components/TextBox/TextBox';

import styles from './Browse.module.scss';

const Browse = (): JSX.Element => {
	const spotifyToken = useAppSelector((state) => state.user.spotifyToken);

	const dispatch = useAppDispatch();

	const [query, setQuery] = useState('');

	const [foundItems, setFoundItems] = useState<{
		albums: IAlbum[];
		tracks: ITrack[];
		artists: IArtist[];
	}>();

	const handleSearch = async () => {
		if (query === '') return;
		if (!spotifyToken) {
			dispatch(
				addAlert({
					message: 'Spotify is not connected',
					type: 'warn'
				})
			);
			return;
		}

		const { albums, artists, tracks } = await SpotifyAPI.search(spotifyToken, query);
		setFoundItems({ albums, tracks, artists });
		console.log(foundItems);
	};

	const handleEnterKey = (event: React.KeyboardEvent) => {
		if (event.key !== 'Enter') return;

		handleSearch();
	};

	return (
		<View title="Browse" id="browse">
			<div className={styles.content}>
				<TextBox size="large" value={query} onChange={(e) => setQuery(e.currentTarget.value)} onKeyDown={handleEnterKey} />
			</div>
		</View>
	);
};

export default Browse;
