/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useState, useEffect, FC } from 'react';
import Lottie from 'lottie-react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setOutputDevice } from '../../../state/slices/playerSlice';
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

import style from './Settings.module.scss';
import '../../styles/_components.scss';

const Settings: FC = () => {
	const outputDeviceId = useAppSelector((state) => state.player.outputDeviceId);
	const spotifyToken = useAppSelector((state) => state.user.spotifyToken);
	const user = useAppSelector((state) => state.user.data);

	const [audioDevices, setOutputDevices] = useState<MediaDeviceInfo[]>();

	const dispatch = useAppDispatch();

	const getOutputDevices = async () => {
		const mediaDevices = await navigator.mediaDevices.enumerateDevices();
		setOutputDevices(mediaDevices.filter((device) => device.kind === 'audiooutput'));
	};

	const onOutputDeviceChange = (e: string) => {
		dispatch(setOutputDevice(e));
	};

	const handleSpotifyLogout = () => {
		dispatch(updateSpotifyToken(''));
	};

	useEffect(() => {
		getOutputDevices();
	}, []);

	return (
		<View title="Settings" id="settings">
			<div className={style.content}>
				<TabControl>
					<TabItem label="Audio Settings">
						<DropdownMenu className={style['audio-device-dropdown']} value={outputDeviceId || 'default'} onChange={onOutputDeviceChange}>
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
						<div className={style['service-section']}>
							{!spotifyToken ? (
								<div onClick={SpotifyAPI.authorize} className={`${style['service-btn']} ${style.spotify}`}>
									Connect to <img src={spotifyLogo} alt="" />
								</div>
							) : (
								<div onClick={handleSpotifyLogout} className={`${style['service-btn']} ${style.spotify}`}>
									Disconnect <img src={spotifyLogo} alt="" />
								</div>
							)}

							{!spotifyToken ? (
								<div className={style['connection-status']}>
									<img className={style['x-mark']} src={xMark} alt="" />
									Not connected
								</div>
							) : (
								<div className={style['connection-status']}>
									<Lottie className={style.lottie} animationData={checkmarkGreen} loop={false} />
									Connected as {user?.name}
								</div>
							)}
						</div>

						<div className={style['service-section']}>
							<div className={`${style['service-btn']} ${style['apple-music']}`}>
								Connect to <img src={appleMusicIcon} alt="" /> Apple Music
							</div>
							<div className={style['connection-status']}>
								<img className={style['x-mark']} src={xMark} alt="" />
								Not connected
							</div>
						</div>
					</TabItem>
					<TabItem label="About">
						<p>tune. 0.1.0</p>
					</TabItem>
				</TabControl>
			</div>
		</View>
	);
};

export default Settings;
