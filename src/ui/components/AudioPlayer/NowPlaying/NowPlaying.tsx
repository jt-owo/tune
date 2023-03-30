import { FC } from 'react';
import defaultAlbumCover from '../../../../../assets/images/tune_no_artwork.svg';

import style from './NowPlaying.module.scss';

interface NowPlayingProps {
	title: string;
	artists: string;
	image?: string;
}

const NowPlaying: FC<NowPlayingProps> = (props) => {
	const { title, artists, image } = props;

	return (
		<div className={style.track}>
			<img src={image ?? defaultAlbumCover} alt="" className={style['current-album-cover']} />
			<div className={style['track-info']}>
				<div className={style['current-track']}>{title}</div>
				<div className={style['current-artist']}>{artists}</div>
			</div>
		</div>
	);
};

export default NowPlaying;
