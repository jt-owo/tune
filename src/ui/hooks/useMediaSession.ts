/* eslint-disable consistent-return */
/* eslint-disable compat/compat */
import { useEffect } from 'react';
import Format from '../util/format';

export interface MediaSessionProps {
	track?: ITrack;
	onPlay: MediaSessionActionHandler | null;
	onPause: MediaSessionActionHandler | null;
	onPreviousTrack: MediaSessionActionHandler | null;
	onNextTrack: MediaSessionActionHandler | null;
}

const useMediaSession = (props: MediaSessionProps) => {
	const { track, onPlay, onPause, onPreviousTrack, onNextTrack } = props;

	const { name, artists, image } = Format.getTrackFormatted(track);

	const { mediaSession } = navigator;

	useEffect(() => {
		mediaSession.metadata = new MediaMetadata({
			title: name,
			artist: artists,
			album: image,
			artwork: [
				{
					src: image,
					sizes: '128x128', // TODO: Determine size from file metadata.
					type: 'image/png'
				}
			]
		});
		return () => {
			mediaSession.metadata = null;
		};
	}, [mediaSession, name, artists, image]);

	useEffect(() => {
		if (!onPlay) return;

		mediaSession.setActionHandler('play', onPlay);
		return () => {
			mediaSession.setActionHandler('play', null);
		};
	}, [mediaSession, onPlay]);
	useEffect(() => {
		if (!onPause) return;

		mediaSession.setActionHandler('pause', onPause);
		return () => {
			mediaSession.setActionHandler('pause', null);
		};
	}, [mediaSession, onPause]);
	useEffect(() => {
		if (!onPreviousTrack) return;

		mediaSession.setActionHandler('previoustrack', onPreviousTrack);
		return () => {
			mediaSession.setActionHandler('previoustrack', null);
		};
	}, [mediaSession, onPreviousTrack]);
	useEffect(() => {
		if (!onNextTrack) return;

		mediaSession.setActionHandler('nexttrack', onNextTrack);
		return () => {
			mediaSession.setActionHandler('nexttrack', null);
		};
	}, [mediaSession, onNextTrack]);
};

export default useMediaSession;
