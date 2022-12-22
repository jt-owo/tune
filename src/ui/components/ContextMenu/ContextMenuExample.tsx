import React from 'react';
import { selectPlaylists } from '../../../state/slices/playlistSlice';
import { PlaylistData } from '../../../typings/playlist';
import { useAppSelector } from '../../hooks';
import useContextMenu from '../../hooks/useContextMenu';
import Dialog from '../Dialog/Dialog';
import ContextMenu from './ContextMenu';
import ContextMenuItem from './ContextMenuItem/ContextMenuItem';

const ContextMenuExample: React.FC = () => {
	const playlists: PlaylistData[] = useAppSelector(selectPlaylists);
	const [isDialogVisible, setDialogVisibility] = React.useState(false);

	const [visibility, setVisibility, position, setPosition] = useContextMenu();

	return (
		<div>
			<Dialog text="Do you really want to delete this playlist?" onClose={() => setDialogVisibility(false)} isOpen={isDialogVisible} />
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
						// FIXME: not sure if e.pageX/Y returns the correct value.
						// console.log('right click', e.pageX, e.pageY);
					}}
				>
					<span>{playlist.name}</span>
				</div>
			))}
			{visibility && (
				<ContextMenu y={position.y} x={position.x}>
					<ContextMenuItem header="Rename" />
					<ContextMenuItem header="Delete" onClick={() => setDialogVisibility(true)} />
				</ContextMenu>
			)}
		</div>
	);
};

export default ContextMenuExample;
