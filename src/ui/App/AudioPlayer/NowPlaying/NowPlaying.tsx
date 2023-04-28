/* eslint-disable no-param-reassign */
import { RefObject, SyntheticEvent, useEffect } from 'react';
import { useAppDispatch } from '../../../hooks';
import { playNext } from '../../../../state/slices/playerSlice';
import Format from '../../../util/format';

import styles from './NowPlaying.module.scss';

interface DisplayTrackProps {
	track: ITrack;
	audioRef: RefObject<TuneHTMLAudioElement>;
	seekBarRef: RefObject<HTMLInputElement>;
	setDuration: React.Dispatch<React.SetStateAction<number>>;
	outputDeviceId: string;
}

const NowPlaying = ({ track, audioRef, seekBarRef, outputDeviceId, setDuration }: DisplayTrackProps) => {
	const dispatch = useAppDispatch();

	const { name, artists, image, isLoaded } = Format.getTrackFormatted(track);

	// Send track to the main process for discord-rpc.
	window.api?.system.setTrack(name, artists, name);

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const onEnded = (_e: SyntheticEvent<TuneHTMLAudioElement>) => dispatch(playNext());

	const onLoadedMetadata = () => {
		if (!audioRef.current || !seekBarRef.current) return;

		const seconds = audioRef.current.duration;
		setDuration(seconds);
	};

	useEffect(() => {
		audioRef?.current?.setSinkId(outputDeviceId);
	}, [audioRef, outputDeviceId]);

	return (
		<>
			<div className={styles.track}>
				{isLoaded && (
					<>
						<img src={image} alt="" className={styles['current-album-cover']} />
						<div className={styles['track-info']}>
							<div className={styles['current-track']}>{name}</div>
							<div className={styles['current-artist']}>{artists}</div>
						</div>
					</>
				)}
			</div>
			{track.service === 'local' && track.filePath && <audio ref={audioRef} src={Format.getFilePath(track.filePath)} onLoadedMetadata={onLoadedMetadata} onEnded={onEnded} />}
		</>
	);
};

export default NowPlaying;
