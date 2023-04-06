import { FC, MouseEvent } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ITrack } from '../../../../typings/types';

import playlistStyle from '../Playlist.module.scss';
import { getTrackFormatted } from '../../../util/formatHelper';

interface PlaylistTrackProps {
	track: ITrack;
	isDragging?: boolean;
	onContextMenu: (event: MouseEvent<HTMLElement>) => void;
}

const PlaylistTrack: FC<PlaylistTrackProps> = (props) => {
	const { track, isDragging, onContextMenu } = props;
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: track.id });

	const { name, artists, image, duration, isLoaded } = getTrackFormatted(track);

	const style = {
		transform: CSS.Transform.toString(transform),
		transition
	};

	return (
		<div className={`${playlistStyle['song-item-container']} ${isDragging ? playlistStyle.hide : ''}`}>
			{isLoaded && (
				<div ref={setNodeRef} style={style} className={playlistStyle['song-item']} onContextMenu={onContextMenu} {...listeners} {...attributes}>
					<img src={image} alt="" draggable={false} />
					<div>
						<div className={playlistStyle['song-title']}>{name}</div>
						<div className={playlistStyle['song-artist']}>{artists}</div>
					</div>
					<div className={playlistStyle['song-duration']}>{duration}</div>
				</div>
			)}
		</div>
	);
};

export default PlaylistTrack;
