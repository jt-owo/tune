import { FC } from 'react';
import { ITrack } from '../../../../typings/types';
import { getTrackFormatted } from '../../../util/formatHelper';
import useMediaSession from '../../../hooks/useMediaSession';

import style from './NowPlaying.module.scss';

interface NowPlayingProps {
	track: ITrack;
	onPlay: () => void;
	onPreviousTrack: () => void;
	onNextTrack: () => void;
}

const NowPlaying: FC<NowPlayingProps> = (props) => {
	const { track, onPlay, onPreviousTrack, onNextTrack } = props;
	const { name, artists, image, isLoaded } = getTrackFormatted(track);

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
		<div className={style.track}>
			{isLoaded && (
				<>
					<img src={image} alt="" className={style['current-album-cover']} />
					<div className={style['track-info']}>
						<div className={style['current-track']}>{name}</div>
						<div className={style['current-artist']}>{artists}</div>
					</div>
				</>
			)}
		</div>
	);
};

export default NowPlaying;
