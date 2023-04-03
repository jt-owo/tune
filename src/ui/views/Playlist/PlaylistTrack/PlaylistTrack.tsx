/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/prop-types */
import { FC, memo, MouseEvent, useEffect, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AudioMetadata } from '../../../../typings/metadata';
import { ITrack } from '../../../../typings/types';
import { getServices } from '../../../util/serviceHelper';
import { getAlbumCover, getDuration, getArtists } from '../../../util/formatHelper';

import playlistStyle from '../Playlist.module.scss';

interface PlaylistTrackProps {
	id: number;
	track: ITrack;
	isDragging?: boolean;
	setCurrentTrack?: (track: ITrack) => void;
	onContextMenu: (event: MouseEvent<HTMLElement>) => void;
}

const PlaylistTrack: FC<PlaylistTrackProps> = memo((props) => {
	const { id, track, isDragging, onContextMenu } = props;

	const { isLocal, isSpotify } = getServices(track.service);
	const [metadata, setMetadata] = useState<AudioMetadata>();

	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition
	};

	useEffect(() => {
		if (isLocal) {
			const loadMetadata = async () => {
				const metadataJSON = await window.api.system.readMetadata(track.name);
				setMetadata(JSON.parse(metadataJSON) as AudioMetadata);
			};

			loadMetadata();
		}
	}, [isLocal, track.name]);

	// FIXME: Remove with library and metadata parse rework.
	const render = () => {
		if (isLocal && metadata) {
			return (
				<div ref={setNodeRef} style={style} className={playlistStyle['song-item']} onContextMenu={onContextMenu} {...listeners} {...attributes}>
					<img src={getAlbumCover(metadata?.info?.cover)} alt="" draggable={false} />
					<div>
						<div className={playlistStyle['song-title']}>{metadata.info?.title}</div>
						<div className={playlistStyle['song-artist']}>{metadata.info?.artist}</div>
					</div>
					<div className={playlistStyle['song-duration']}>{getDuration(metadata?.info?.duration)}</div>
				</div>
			);
		}

		if (isSpotify) {
			return (
				<div ref={setNodeRef} style={style} className={playlistStyle['song-item']} onContextMenu={onContextMenu} {...listeners} {...attributes}>
					<img src={getAlbumCover(track.album?.images[0].url)} alt="" draggable={false} />
					<div>
						<div className={playlistStyle['song-title']}>{track.name}</div>
						<div className={playlistStyle['song-artist']}>{getArtists(track.artists)}</div>
					</div>
					<div className={playlistStyle['song-duration']}>{getDuration((track.duration ?? 0) / 1000)}</div>
				</div>
			);
		}

		return null;
	};

	return <div className={`${playlistStyle['song-item-container']} ${isDragging ? playlistStyle.hide : ''}`}>{render()}</div>;
});

export default PlaylistTrack;
