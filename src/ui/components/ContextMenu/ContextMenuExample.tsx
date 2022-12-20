import React from 'react';
import { selectPlaylists } from '../../../state/slices/playlistSlice';
import { PlaylistData } from '../../../typings/playlist';
import { useAppSelector } from '../../hooks';
import useContextMenu from '../../hooks/useContextMenu';
import ContextMenu from './ContextMenu';
import ContextMenuItem from './ContextMenuItem/ContextMenuItem';

const ContextMenuExample: React.FC = () => {
	const playlists: PlaylistData[] = useAppSelector(selectPlaylists);
	const [visibility, setVisibility, position, setPosition] = useContextMenu();

	return (
		<div>
			{playlists.map((playlist) => (
				<div
					key={playlist.id}
					onContextMenu={(e) => {
						e.preventDefault();
						setVisibility(true);
						setPosition({
							x: e.pageX,
							y: e.pageY
						});
						// FIXME: not sure if e.pageX returns the correct value.
						// console.log('right click', e.pageX, e.pageY);
					}}
				>
					<span>{playlist.name}</span>
				</div>
			))}
			{visibility && (
				<ContextMenu y={position.y} x={position.x}>
					<ContextMenuItem header="Rename" />
					<ContextMenuItem header="Delete" />
				</ContextMenu>
			)}
		</div>
	);
};

export default ContextMenuExample;
