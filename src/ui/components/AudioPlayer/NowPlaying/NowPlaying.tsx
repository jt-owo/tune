import { FC, useEffect, useState } from 'react';
import { ITrack } from '../../../../typings/types';
import { getServices } from '../../../util/serviceHelper';
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

	const [parsedTrack, setTrack] = useState(track);

	const { isLocal } = getServices(track.service);

	useEffect(() => {
		if (isLocal) {
			const loadMetadata = async () => {
				const metadataJSON = await window.api.system.loadMetadata(JSON.stringify(track));
				setTrack(JSON.parse(metadataJSON) as ITrack);
			};

			loadMetadata();
		}
	}, [isLocal, track]);

	const { name, artists, image, isLoaded } = getTrackFormatted(parsedTrack);

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
