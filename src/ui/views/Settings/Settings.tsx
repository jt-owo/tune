/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useState, useEffect, FC, ChangeEvent } from 'react';
import Lottie from 'lottie-react';
import { selectOutputDeviceId, selectSpotifyToken, setOutputDevice, updateSpotifyToken, selectUser } from '../../../state/slices/playerSlice';
import { useAppDispatch, useAppSelector } from '../../hooks';
import SpotifyAPI from '../../util/spotifyAPI';

import View from '../../components/View/View';
import TabControl from '../../components/TabControl/TabControl';
import TabItem from '../../components/TabControl/TabItem/TabItem';

import spotifyLogo from '../../../../assets/service-icons/Spotify_Logo_RGB_White.png';
import appleMusicIcon from '../../../../assets/service-icons/Apple_Music_Icon_W.svg';
import checkmarkGreen from '../../../../assets/animations/checkmark-green.json';
import xMark from '../../../../assets/ui-icons/x-mark.svg';

import style from './Settings.module.scss';
import '../../styles/_components.scss';

const Settings: FC = () => {
	const selectedOutputDevice = useAppSelector(selectOutputDeviceId);
	const spotifyToken = useAppSelector(selectSpotifyToken);
	const user = useAppSelector(selectUser);

	const [audioDevices, setOutputDevices] = useState<MediaDeviceInfo[]>();

	const dispatch = useAppDispatch();

	const getOutputDevices = async () => {
		const mediaDevices = await navigator.mediaDevices.enumerateDevices();
		setOutputDevices(mediaDevices.filter((device) => device.kind === 'audiooutput'));
	};

	const onOutputDeviceChange = (e: ChangeEvent<HTMLSelectElement>) => {
		dispatch(setOutputDevice(e.currentTarget.value));
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
						<select className="dropdown-select-1" onChange={onOutputDeviceChange} value={selectedOutputDevice || 'default'}>
							{audioDevices &&
								audioDevices.map((device) => {
									return (
										<option key={device.deviceId} value={device.deviceId}>
											{device.deviceId.toLowerCase() === 'default' ? 'Default Audio Device' : device.label}
										</option>
									);
								})}
						</select>
					</TabItem>
					<TabItem label="Appearance">
						<div> </div>
					</TabItem>
					<TabItem label="Streaming Services">
						<div className={style['service-section']}>
							{!spotifyToken ? (
								<a onClick={SpotifyAPI.authorize} className={`${style['service-btn']} ${style.spotify}`}>
									Connect to <img src={spotifyLogo} alt="" />
								</a>
							) : (
								<a onClick={handleSpotifyLogout} className={`${style['service-btn']} ${style.spotify}`}>
									Disconnect <img src={spotifyLogo} alt="" />
								</a>
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
							<a href="/" className={`${style['service-btn']} ${style['apple-music']}`}>
								Connect to <img src={appleMusicIcon} alt="" /> Apple Music
							</a>
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
