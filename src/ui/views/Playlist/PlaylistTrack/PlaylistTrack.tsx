/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-nested-ternary */
import { MouseEvent } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Format from '../../../util/format';
import ToolTip from '../../../components/ToolTip/ToolTip';

import playlistStyle from '../Playlist.module.scss';

import localIcon from '../../../../../assets/ui-icons/hard-drive.svg';
import spotifyIcon from '../../../../../assets/service-icons/Spotify_Icon_RGB_Green.png';

interface PlaylistTrackProps {
	track: ITrack;
	locked: boolean;
	isDragging?: boolean;
	onContextMenu: (event: MouseEvent<HTMLElement>) => void;
}

const PlaylistTrack = ({ track, locked, isDragging, onContextMenu }: PlaylistTrackProps): JSX.Element => {
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: track.id });
	const { name, artists, album, image, duration, isLoaded } = Format.getTrackFormatted(track);

	const style = {
		transform: CSS.Transform.toString(transform),
		transition
	};

	return (
		<div className={`${playlistStyle['song-item-container']} ${isDragging ? playlistStyle.hide : ''}`}>
			{isLoaded && (
				<>
					{locked ? (
						<div className={playlistStyle['song-item']} onContextMenu={onContextMenu}>
							<div className={playlistStyle['cover-title-artist']}>
								<img src={image} alt="" draggable={false} />
								<div className={playlistStyle['title-artist-container']}>
									<div className={playlistStyle['song-title']}>{name}</div>
									<div className={playlistStyle['song-artist']}>{artists}</div>
								</div>
							</div>
							<div className={playlistStyle.album}>{album}</div>
							<div className={playlistStyle.source}>
								<ToolTip text={track.service === 'local' ? 'Local file' : 'Spotify'}>{track.service === 'local' ? <img src={localIcon} alt="" className={`${playlistStyle['source-icon']} ${playlistStyle.local}`} /> : <img src={track.service === 'spotify' ? spotifyIcon : ''} alt="" className={`${playlistStyle['source-icon']} ${playlistStyle.spotify}`} />}</ToolTip>
							</div>

							<div className={playlistStyle['song-duration']}>{duration}</div>
						</div>
					) : (
						<div ref={setNodeRef} style={style} className={playlistStyle['song-item']} onContextMenu={onContextMenu} {...listeners} {...attributes}>
							<div className={playlistStyle['cover-title-artist']}>
								<img src={image} alt="" draggable={false} />
								<div className={playlistStyle['title-artist-container']}>
									<div className={playlistStyle['song-title']}>{name}</div>
									<div className={playlistStyle['song-artist']}>{artists}</div>
								</div>
							</div>
							<div className={playlistStyle.album}>{album}</div>
							<div className={playlistStyle.source}>
								<ToolTip text={track.service === 'local' ? 'Local file' : 'Spotify'}>{track.service === 'local' ? <img src={localIcon} alt="" className={`${playlistStyle['source-icon']} ${playlistStyle.local}`} /> : <img src={track.service === 'spotify' ? spotifyIcon : ''} alt="" className={`${playlistStyle['source-icon']} ${playlistStyle.spotify}`} />}</ToolTip>
							</div>

							<div className={playlistStyle['song-duration']}>{duration}</div>
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default PlaylistTrack;
