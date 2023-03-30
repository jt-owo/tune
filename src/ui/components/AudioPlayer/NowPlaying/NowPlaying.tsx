import { FC } from 'react';
import { AudioMetadata } from '../../../../typings/metadata';
import defaultAlbumCover from '../../../../../assets/images/tune_no_artwork.svg';

import style from './NowPlaying.module.scss';

interface NowPlayingProps {
	metadata: AudioMetadata;
}

const NowPlaying: FC<NowPlayingProps> = (props) => {
	const { metadata } = props;

	const getAlbumCover = () => {
		if (metadata?.info?.cover) {
			return metadata.info.cover;
		}
		return defaultAlbumCover;
	};

	return (
		<div className={style.track}>
			<img src={getAlbumCover()} alt="" className={style['current-album-cover']} />
			<div className={style['track-info']}>
				<div className={style['current-track']}>{metadata.info?.title}</div>
				<div className={style['current-artist']}>{metadata.info?.artist}</div>
			</div>
		</div>
	);
};

export default NowPlaying;
