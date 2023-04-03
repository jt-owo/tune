import { FC, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { selectSpotifyToken } from '../../../state/slices/playerSlice';
import { addAlert } from '../../../state/slices/alertSlice';
import { IAlbum, IArtist, ITrack } from '../../../typings/types';
import SpotifyAPI from '../../api/spotify';
import newGuid from '../../util';

import View from '../../components/View/View';

import style from './Browse.module.scss';

const Browse: FC = () => {
	const spotifyToken = useAppSelector(selectSpotifyToken);

	const dispatch = useAppDispatch();

	const [query, setQuery] = useState('');

	const [foundItems, setFoundItems] = useState<{
		albums: IAlbum[];
		tracks: ITrack[];
		artists: IArtist[];
	}>();

	const handleSearch = async (event: React.KeyboardEvent) => {
		if (query !== '' && event.key === 'Enter') {
			if (!spotifyToken) {
				dispatch(
					addAlert({
						id: newGuid(),
						message: 'Spotify is not connected',
						type: 'error'
					})
				);
				return;
			}

			const { albums, artists, tracks } = await SpotifyAPI.search(spotifyToken, query);
			setFoundItems({ albums, tracks, artists });
		}
	};

	return (
		<View title="Browse" id="browse">
			<div className={style.content}> </div>
			<input type="text" className={style['text-input-3']} value={query} onChange={(e) => setQuery(e.currentTarget.value)} onKeyDown={handleSearch} />
		</View>
	);
};

export default Browse;
