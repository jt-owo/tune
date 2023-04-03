/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/prop-types */
import { FC, memo, MouseEvent, useEffect, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AudioMetadata } from '../../../../typings/metadata';
import { ITrack } from '../../../../typings/types';

import playlistStyle from '../Playlist.module.scss';

import defaultAlbumCover from '../../../../../assets/images/tune_no_artwork.svg';

interface PlaylistTrackProps {
	id: number;
	track: ITrack;
	isDragging?: boolean;
	setCurrentTrack?: (track: ITrack) => void;
	onContextMenu: (event: MouseEvent<HTMLElement>) => void;
}

const PlaylistTrack: FC<PlaylistTrackProps> = memo((props) => {
	const { id, track, isDragging, onContextMenu } = props;

	const [metadata, setMetadata] = useState<AudioMetadata>();

	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition
	};

	useEffect(() => {
		if (track.isLocal) {
			const getMetadata = async () => {
				const metadataJSON = await window.api.system.readMetadata(track.name);
				setMetadata(JSON.parse(metadataJSON) as AudioMetadata);
			};

			getMetadata();
		}
	}, [track.isLocal, track.name]);

	const getAlbumCover = (url?: string) => {
		if (url) return url;
		return defaultAlbumCover;
	};

	const getDuration = (duration?: number) => {
		if (duration) {
			const minutes = Math.floor(duration / 60);
			const seconds = Math.floor(duration - minutes * 60);

			if (seconds < 10) {
				return `${minutes}:0${seconds}`;
			}
			return `${minutes}:${seconds}`;
		}
		return NaN;
	};

	const getArtists = () => {
		let artists = '';
		if (track.artists) {
			track.artists.forEach((artist) => {
				if (artists === '') artists += artist.name;
				else artists += `, ${artist.name}`;
			});
		}

		return artists;
	};

	return (
		<div className={`${playlistStyle['song-item-container']} ${isDragging ? playlistStyle.hide : ''}`}>
			{track.isLocal && metadata ? (
				<div ref={setNodeRef} style={style} className={playlistStyle['song-item']} onContextMenu={onContextMenu} {...listeners} {...attributes}>
					<img src={getAlbumCover(metadata?.info?.cover)} alt="" draggable={false} />
					<div>
						<div className={playlistStyle['song-title']}>{metadata.info?.title}</div>
						<div className={playlistStyle['song-artist']}>{metadata.info?.artist}</div>
					</div>
					<div className={playlistStyle['song-duration']}>{getDuration(metadata?.info?.duration)}</div>
				</div>
			) : (
				<div ref={setNodeRef} style={style} className={playlistStyle['song-item']} onContextMenu={onContextMenu} {...listeners} {...attributes}>
					<img src={getAlbumCover(track.album?.images[0].url)} alt="" draggable={false} />
					<div>
						<div className={playlistStyle['song-title']}>{track.name}</div>
						<div className={playlistStyle['song-artist']}>{getArtists()}</div>
					</div>
					<div className={playlistStyle['song-duration']}>{getDuration((track.duration ?? 0) / 1000)}</div>
				</div>
			)}
		</div>
	);
});

export default PlaylistTrack;
