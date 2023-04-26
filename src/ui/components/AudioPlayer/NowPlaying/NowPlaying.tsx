import useMediaSession from '../../../hooks/useMediaSession';
import Format from '../../../util/format';

import styles from './NowPlaying.module.scss';

interface NowPlayingProps {
	track: ITrack;
	onPlay: () => void;
	onPreviousTrack: () => void;
	onNextTrack: () => void;
}

const NowPlaying = ({ track, onPlay, onPreviousTrack, onNextTrack }: NowPlayingProps): JSX.Element => {
	const { name, artists, image, isLoaded } = Format.getTrackFormatted(track);

	// Set track so the main process knows what track is currently playing.
	window.api?.system.setTrack(name, artists, name);

	useMediaSession({
		title: name,
		artist: artists,
		album: image,
		artwork: [
			{
				src: image,
				sizes: '128x128', // TODO: Determine size from file metadata.
				type: 'image/png'
			}
		],
		onPlay,
		onPause: onPlay,
		onPreviousTrack,
		onNextTrack
	});

	return (
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
	);
};

export default NowPlaying;
