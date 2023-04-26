/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useRef } from 'react';
import RenameDialog from '../../../components/RenameDialog/RenameDialog';
import ToolTip from '../../../components/ToolTip/ToolTip';
import ContextMenu from '../../../components/ContextMenu/ContextMenu';
import ContextMenuItem from '../../../components/ContextMenu/ContextMenuItem/ContextMenuItem';
import useContextMenu from '../../../hooks/useContextMenu';
import Format from '../../../util/format';
import styles from '../Playlist.module.scss';

import playIcon from '../../../../../assets/ui-icons/play-solid.svg';
import shuffleIcon from '../../../../../assets/ui-icons/shuffle.svg';
import threeDotsIcon from '../../../../../assets/ui-icons/three-dots.svg';
import filePlusIcon from '../../../../../assets/ui-icons/file-plus.svg';
import deleteIcon from '../../../../../assets/ui-icons/trash-2.svg';

import lockIcon from '../../../../../assets/animations/lock.json';
import checkboxIcon from '../../../../../assets/animations/bookmark.json';

interface PlaylistHeaderProps {
	playlist: IPlaylist;
	handlePlay: () => void;
	handleAddTracks: () => void;
	handleRename: (data: string) => void;
	toggleRename: () => void;
	toggleDialog: () => void;
	handleToggleRename: () => void;
	handleLockPlaylist: () => void;
	handlePinPlaylist: () => void;
	renameVisible: boolean;
	shouldFloat: boolean;
}

const PlaylistHeader = ({ playlist, handlePlay, handleAddTracks, handleRename, toggleRename, toggleDialog, handleToggleRename, handleLockPlaylist, handlePinPlaylist, renameVisible, shouldFloat }: PlaylistHeaderProps) => {
	const playlistMenuRef = useRef<HTMLDivElement>(null);

	const [isPlaylistOptionsVisible, togglePlaylistOptions, playlistOptionsPosition, setPlaylistOptionsPosition] = useContextMenu(playlistMenuRef);

	return (
		<>
			{shouldFloat ? (
				<>
					<div style={{ height: 260 }} />
					<div className={`${styles['playlist-header-float']}`}>
						<img src={Format.getImage(playlist.images)} alt="" draggable={false} />
						<div>
							<div className={styles['playlist-heading-title']} onClick={handleToggleRename}>
								{playlist?.name}
							</div>
							<div className={styles['playlist-heading-duration']}>{/** TODO: Add plylist duration once implemented  */}</div>
						</div>
						<div className={styles['playlist-controls']}>
							{playlist.service === 'local' && (
								<>
									<div className={`${styles['playlist-heading-btn']} ${styles['btn-hover-animation']} ${styles['playlist-play-btn']}`} onClick={handlePlay}>
										<img className={styles['play-icon']} src={playIcon} alt="" draggable="false" />
										Play
									</div>
									<div className={`${styles['playlist-heading-btn']} ${styles['btn-hover-animation']} ${styles['playlist-play-btn']}`} onClick={handlePlay}>
										<img className={styles['shuffle-icon']} src={shuffleIcon} alt="" draggable="false" />
										Shuffle
									</div>
									<ToolTip text="More">
										<div
											ref={playlistMenuRef}
											className={`${styles['playlist-heading-btn']} ${styles['btn-hover-animation']} ${styles['playlist-menu-btn']}`}
											onClick={(e) => {
												e.preventDefault();
												togglePlaylistOptions();
												setPlaylistOptionsPosition({
													x: e.pageX - 100,
													y: e.pageY
												});
											}}
										>
											<img src={threeDotsIcon} alt="" className={styles['menu-icon']} />
										</div>
									</ToolTip>
								</>
							)}
						</div>
					</div>
				</>
			) : (
				<div className={styles['playlist-heading']}>
					<RenameDialog value={playlist?.name} cb={handleRename} visible={renameVisible} onClose={toggleRename} position={{ x: 250, y: 80 }} />
					<img src={Format.getImage(playlist.images)} alt="" className={styles['playlist-heading-image']} draggable={false} />
					<div className={styles['playlist-heading-content']}>
						<div className={styles['playlist-heading-title']} onClick={handleToggleRename}>
							{playlist?.name}
						</div>
						<div className={styles['playlist-heading-description']}>{playlist.description || 'This is a template description'}</div>
						<div className={styles['playlist-heading-duration']}>{/** TODO: Add plylist duration once implemented  */}</div>
						<div className={styles['playlist-controls']}>
							{playlist.service === 'local' && (
								<>
									<div className={`${styles['playlist-heading-btn']} ${styles['btn-hover-animation']} ${styles['playlist-play-btn']}`} onClick={handlePlay}>
										<img className={styles['play-icon']} src={playIcon} alt="" draggable="false" />
										Play
									</div>
									<div className={`${styles['playlist-heading-btn']} ${styles['btn-hover-animation']} ${styles['playlist-play-btn']}`} onClick={handlePlay}>
										<img className={styles['shuffle-icon']} src={shuffleIcon} alt="" draggable="false" />
										Shuffle
									</div>
									<ToolTip text="More">
										<div
											ref={playlistMenuRef}
											className={`${styles['playlist-heading-btn']} ${styles['btn-hover-animation']} ${styles['playlist-menu-btn']}`}
											onClick={(e) => {
												e.preventDefault();
												togglePlaylistOptions();
												setPlaylistOptionsPosition({
													x: e.pageX,
													y: e.pageY
												});
											}}
										>
											<img src={threeDotsIcon} alt="" className={styles['menu-icon']} />
										</div>
									</ToolTip>
								</>
							)}
						</div>
					</div>
				</div>
			)}
			{isPlaylistOptionsVisible && (
				<ContextMenu y={playlistOptionsPosition.y} x={playlistOptionsPosition.x}>
					<ContextMenuItem text="Add Songs" staticIcon={filePlusIcon} type="default" onClick={handleAddTracks} />
					<ContextMenuItem text={playlist.locked ? 'Unlock playlist' : 'Lock playlist'} lottieIcon={lockIcon} type="default" onClick={handleLockPlaylist} active={playlist.locked} activeFrame={9} />
					<ContextMenuItem text={playlist.pinned ? 'Unpin playlist' : 'Pin playlist'} lottieIcon={checkboxIcon} type="default" onClick={handlePinPlaylist} active={!playlist.pinned} activeFrame={9} />
					<ContextMenuItem text="Delete Playlist" staticIcon={deleteIcon} type="danger" onClick={toggleDialog} />
				</ContextMenu>
			)}
		</>
	);
};

export default PlaylistHeader;
