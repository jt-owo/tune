/* eslint-disable jsx-a11y/media-has-caption */
import * as React from 'react';
import { useEffect, useRef } from 'react';
import { play, playNext, playPrevious, selectCurrentTrack, selectIsPlaying, selectOutputDeviceId } from '../../../state/slices/playerSlice';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { AudioMetadata, TrackData } from '../../../typings/playlist';

import AudioControlButton from './AudioControlButton/AudioControlButton';
import PlayPauseButton from './PlayPauseButton/PlayPauseButton';
import SeekBar from './SeekBar/SeekBar';
import NowPlaying from './NowPlaying/NowPlaying';
import ServiceSelector from './ServiceSelector/ServiceSelector';
import VolumeSlider from './VolumeSlider/VolumeSlider';
import useMediaSession from '../../hooks/useMediaSession';

import playBtn from '../../../../assets/animations/playPause.json';
import skipBackBtn from '../../../../assets/animations/skipBack.json';
import skipForwardBtn from '../../../../assets/animations/skipForward.json';

import './AudioPlayer.scss';
const AudioPlayer: React.FC = () => {
	const audioRef = useRef<HTMLAudioElement & { setSinkId(deviceId: string): void; volume: number }>(null);

	const currentTrack = useAppSelector(selectCurrentTrack);
	const isPlaying = useAppSelector(selectIsPlaying);
	const outputDeviceId = useAppSelector(selectOutputDeviceId);

	const [volume, setVolume] = useState(1);
	const [metadata, setMetadata] = useState<AudioMetadata>();
  
	const dispatch = useAppDispatch();

	const getMetadata = async (track: TrackData) => {
		const metadataJSON = await window.ipc.system.readMetadata(track.filePath);
		setMetadata(JSON.parse(metadataJSON) as AudioMetadata);
	};

	const handlePlayPause = () => {
		dispatch(play());
	};

	const handlePlayNext = () => {
		dispatch(playNext());
	};

	const handlePlayPrev = () => {
		dispatch(playPrevious());
	};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const onEnded = (_e: React.SyntheticEvent<HTMLAudioElement>) => {
		handlePlayNext();
	};

	useEffect(() => {
		if (audioRef.current && outputDeviceId) {
			audioRef.current.setSinkId(outputDeviceId);
		}
	}, [audioRef, outputDeviceId]);

	useEffect(() => {
		if (!audioRef.current) return;

		if (isPlaying) {
			audioRef.current.play().catch(() => {});
			if (currentTrack) getMetadata(currentTrack);
		} else {
			audioRef.current.pause();
		}
	}, [audioRef, isPlaying, currentTrack]);

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
		<div id="player-container">
			<div id="player-controls-container">
				<ServiceSelector />
				<div id="player-control-divider" />
				{currentTrack?.metadata && <NowPlaying metadata={currentTrack.metadata} />}
				<VolumeSlider audioRef={audioRef} />
				<SeekBar audioRef={audioRef} />
				<AudioControlButton id="skip-back-btn" onClick={handlePlayPrev} animationData={skipBackBtn} />
				<PlayPauseButton isPlaying={isPlaying} onClick={handlePlayPause} animationData={playBtn} />
				<AudioControlButton id="skip-forward-btn" onClick={handlePlayNext} animationData={skipForwardBtn} />
			</div>
			<audio src={currentTrack?.filePath} ref={audioRef} onEnded={onEnded} crossOrigin="anonymous" />
		</div>
	);
};

export default AudioPlayer;
