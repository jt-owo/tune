/* eslint-disable jsx-a11y/media-has-caption */
import { FC, SyntheticEvent, useEffect, useRef, useState, useCallback } from 'react';
import { play, playNext, playPrevious, selectCurrentTrack, selectIsPlaying, selectOutputDeviceId, selectSpotifyToken, updatePlaybackState } from '../../../state/slices/playerSlice';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { AudioMetadata } from '../../../typings/metadata';
import { ITrack } from '../../../typings/types';

import AudioControlButton from './AudioControlButton/AudioControlButton';
import PlayPauseButton from './PlayPauseButton/PlayPauseButton';
import SeekBar from './SeekBar/SeekBar';
import NowPlaying from './NowPlaying/NowPlaying';
import ServiceSelector from './ServiceSelector/ServiceSelector';
import VolumeSlider from './VolumeSlider/VolumeSlider';
import useMediaSession from '../../hooks/useMediaSession';
import ShuffleButton from './ShuffleButton/ShuffleButton';
import RepeatButton from './RepeatButton/RepeatButton';

import playBtn from '../../../../assets/animations/playPause.json';
import skipBackBtn from '../../../../assets/animations/skipBack.json';
import skipForwardBtn from '../../../../assets/animations/skipForward.json';

import style from './AudioPlayer.module.scss';
import SpotifyAPI from '../../api/spotify';

const AudioPlayer: FC = () => {
	const audioRef = useRef<HTMLAudioElement & { setSinkId(deviceId: string): void; volume: number }>(null);

	const currentTrack = useAppSelector(selectCurrentTrack);
	const isPlaying = useAppSelector(selectIsPlaying);
	const outputDeviceId = useAppSelector(selectOutputDeviceId);
	const spotifyToken = useAppSelector(selectSpotifyToken);

	const [metadata, setMetadata] = useState<AudioMetadata>();

	const dispatch = useAppDispatch();

	const getArtists = () => {
		let artists = '';
		if (currentTrack?.artists) {
			currentTrack.artists.forEach((artist) => {
				if (artists === '') artists += artist.name;
				else artists += `, ${artist.name}`;
			});
		}

		return artists;
	};

	const getMetadata = async (track: ITrack) => {
		const metadataJSON = await window.api.system.readMetadata(track.name);
		setMetadata(JSON.parse(metadataJSON) as AudioMetadata);
	};

	const handlePlayPause = useCallback(() => {
		dispatch(play());
	}, [dispatch]);

	const handlePlayNext = () => {
		dispatch(playNext());
	};

	const handlePlayPrev = () => {
		dispatch(playPrevious());
	};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const onEnded = (_e: SyntheticEvent<HTMLAudioElement>) => {
		handlePlayNext();
	};

	useEffect(() => {
		const getPlaybackState = async (accessToken: string) => {
			const playbackState = await SpotifyAPI.fetchPlaybackState(accessToken);
			dispatch(updatePlaybackState(playbackState));
		};

		if (spotifyToken) getPlaybackState(spotifyToken);
	}, [dispatch, spotifyToken]);

	useEffect(() => {
		if (audioRef.current && outputDeviceId) {
			audioRef.current.setSinkId(outputDeviceId);
		}
	}, [audioRef, outputDeviceId]);

	useEffect(() => {
		if (!audioRef.current) return;

		if (isPlaying) {
			audioRef.current.play().catch(() => {});
			if (currentTrack && currentTrack.isLocal) getMetadata(currentTrack);
		} else {
			audioRef.current.pause();
		}
	}, [audioRef, isPlaying, currentTrack]);

	// Adds keyboard shortcuts for play/pause. Maybe more in the future?
	useEffect(() => {
		// Spacebar for play/pause.
		document.addEventListener('keydown', (e) => {
			if (e.code === 'Space') {
				// Don't trigger if the user is typing in a text field.
				if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

				e.preventDefault();
				handlePlayPause();
			}
		});

		// Cleanup
		return () => {
			document.removeEventListener('keydown', () => {});
		};
	}, [handlePlayPause]);

	useMediaSession({
		title: metadata?.info?.title,
		artist: metadata?.info?.artist,
		album: metadata?.info?.album,
		artwork: [
			{
				src: metadata?.info?.cover ?? '',
				sizes: '128x128', // TODO: Determine size from file metadata.
				type: 'image/png'
			}
		],
		onPlay: handlePlayPause,
		onPause: handlePlayPause,
		onPreviousTrack: handlePlayPrev,
		onNextTrack: handlePlayNext
	});

	return (
		<div className={style['player-container']}>
			<div className={style['player-controls-container']}>
				<ServiceSelector />
				<div className={style['player-control-divider']} />
				{metadata && <NowPlaying artists={metadata.info?.artist ?? ''} title={metadata.info?.title ?? ''} image={metadata.info?.cover} />}
				{currentTrack && !currentTrack.isLocal && <NowPlaying title={currentTrack?.name ?? ''} artists={getArtists()} image={currentTrack?.album?.images[0].url} />}
				<VolumeSlider audioRef={audioRef} />
				<SeekBar audioRef={audioRef} />
				<AudioControlButton id="skip-back-btn" onClick={handlePlayPrev} animationData={skipBackBtn} />
				<PlayPauseButton isPlaying={isPlaying} onClick={handlePlayPause} animationData={playBtn} />
				<AudioControlButton id="skip-forward-btn" onClick={handlePlayNext} animationData={skipForwardBtn} />
				<ShuffleButton />
				<RepeatButton />
			</div>
			{currentTrack?.isLocal && <audio src={currentTrack?.name} ref={audioRef} onEnded={onEnded} crossOrigin="anonymous" />}
		</div>
	);
};

export default AudioPlayer;
