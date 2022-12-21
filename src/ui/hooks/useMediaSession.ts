/* eslint-disable consistent-return */
/* eslint-disable compat/compat */
import { useEffect } from 'react';

interface Artwork {
	src: string;
	sizes: string;
	type?: string;
}

export interface MediaSessionProps {
	title?: string;
	artist?: string;
	album?: string;
	artwork?: Artwork[];

	onPlay: MediaSessionActionHandler | null;
	onPause: MediaSessionActionHandler | null;
	onPreviousTrack: MediaSessionActionHandler | null;
	onNextTrack: MediaSessionActionHandler | null;
}

const useMediaSession = (props: MediaSessionProps) => {
	const {
		title = '',
		artist = '',
		album = '',
		artwork = [],

		onPlay,
		onPause,
		onPreviousTrack,
		onNextTrack
	} = props;

	const { mediaSession } = navigator;

	useEffect(() => {
		mediaSession.metadata = new MediaMetadata({
			title,
			artist,
			album,
			artwork
		});
		return () => {
			mediaSession.metadata = null;
		};
	}, [title, artist, album, artwork, mediaSession]);

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
