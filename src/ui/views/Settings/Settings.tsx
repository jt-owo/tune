import { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { updateOutputDevice } from '../../../state/slices/playerSlice';
import { updateSpotifyToken } from '../../../state/slices/userSlice';
import SpotifyAPI from '../../api/spotify';

import View from '../../components/View/View';

import TabControl from '../../components/TabControl/TabControl';
import TabItem from '../../components/TabControl/TabItem/TabItem';
import DropdownMenu from '../../components/DropdownMenu/DropdownMenu';
import DropdownMenuItem from '../../components/DropdownMenu/DropdownMenuItem/DropdownMenuItem';

import spotifyLogo from '../../../../assets/service-icons/Spotify_Logo_RGB_White.png';
import appleMusicIcon from '../../../../assets/service-icons/Apple_Music_Icon_W.svg';
import checkmarkGreen from '../../../../assets/animations/checkmark-green.json';
import xMark from '../../../../assets/ui-icons/x-mark.svg';

import styles from './Settings.module.scss';

const Settings = (): JSX.Element => {
	const outputDeviceId = useAppSelector((state) => state.player.playback.outputDeviceId);
	const spotifyToken = useAppSelector((state) => state.user.spotifyToken);
	const userName = useAppSelector((state) => state.user.data?.name);

	const [audioDevices, setOutputDevices] = useState<MediaDeviceInfo[]>([]);

	const dispatch = useAppDispatch();

	const loadOutputDevices = async () => {
		const mediaDevices = await navigator.mediaDevices.enumerateDevices();
		setOutputDevices(mediaDevices.filter((device) => device.kind === 'audiooutput'));
	};

	const handleOutputDeviceChange = (e: string) => dispatch(updateOutputDevice(e));

	const handleSpotifyLogout = () => dispatch(updateSpotifyToken(''));

	useEffect(() => {
		loadOutputDevices();
	}, []);

	return (
		<View title="Settings" id="settings">
			<div className={styles.content}>
				<TabControl>
					<TabItem label="Audio Settings">
						<DropdownMenu className={styles['audio-device-dropdown']} value={outputDeviceId || 'default'} onChange={handleOutputDeviceChange}>
							{audioDevices &&
								audioDevices.map((device) => {
									return <DropdownMenuItem key={device.deviceId} value={device.deviceId} label={device.deviceId.toLowerCase() === 'default' ? 'Default Audio Device' : device.label} />;
								})}
						</DropdownMenu>
					</TabItem>
					<TabItem label="Appearance">
						<div> </div>
					</TabItem>
					<TabItem label="Streaming Services">
						<div className={styles['service-section']}>
							{!spotifyToken ? (
								<div onClick={SpotifyAPI.authorize} className={`${styles['service-btn']} ${styles.spotify}`}>
									Connect to <img src={spotifyLogo} alt="" />
								</div>
							) : (
								<div onClick={handleSpotifyLogout} className={`${styles['service-btn']} ${styles.spotify}`}>
									Disconnect <img src={spotifyLogo} alt="" />
								</div>
							)}

							{!spotifyToken ? (
								<div className={styles['connection-status']}>
									<img className={styles['x-mark']} src={xMark} alt="" />
									Not connected
								</div>
							) : (
								<div className={styles['connection-status']}>
									<Lottie className={styles.lottie} animationData={checkmarkGreen} loop={false} />
									Connected as {userName}
								</div>
							)}
						</div>

						<div className={styles['service-section']}>
							<div className={`${styles['service-btn']} ${styles['apple-music']}`}>
								Connect to <img src={appleMusicIcon} alt="" /> Apple Music
							</div>
							<div className={styles['connection-status']}>
								<img className={styles['x-mark']} src={xMark} alt="" />
								Not connected
							</div>
						</div>
					</TabItem>
					<TabItem label="About">
						<p>tune. 0.1.0</p>
						<a href="https://bitmovin.com/demos/drm">DRM Module Test</a>
					</TabItem>
				</TabControl>
			</div>
		</View>
	);
};

export default Settings;
