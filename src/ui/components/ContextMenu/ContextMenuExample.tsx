import { FC, useState } from 'react';
import { selectPlaylists } from '../../../state/slices/playlistSlice';
import { useAppSelector } from '../../hooks';
import { IPlaylist } from '../../../typings/types';
import useContextMenu from '../../hooks/useContextMenu';
import Dialog from '../Dialog/Dialog';
import ContextMenu from './ContextMenu';
import ContextMenuItem from './ContextMenuItem/ContextMenuItem';

import editIcon from '../../../../assets/ui-icons/edit-3.svg';
import deleteIcon from '../../../../assets/ui-icons/trash-2.svg';

const ContextMenuExample: FC = () => {
	const playlists: IPlaylist[] = useAppSelector(selectPlaylists);
	const [isDialogVisible, setDialogVisibility] = useState(false);

	const [visibility, setVisibility, position, setPosition] = useContextMenu();

	return (
		<div>
			<Dialog heading="Delete?" description="You are about to delete this playlist. This action cannot be undone!" onClose={() => setDialogVisibility(false)} isOpen={isDialogVisible} type="danger" confirmText="Delete" rejectText="Keep" />
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
					<ContextMenuItem header="Edit" staticIcon={editIcon} type="default" />
					<ContextMenuItem header="Delete" staticIcon={deleteIcon} type="danger" onClick={() => setDialogVisibility(true)} />
				</ContextMenu>
			)}
		</div>
	);
};

export default ContextMenuExample;
