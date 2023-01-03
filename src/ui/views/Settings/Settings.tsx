import * as React from 'react';
import { useState, useEffect } from 'react';
import { selectOutputDeviceId, setOutputDevice } from '../../../state/slices/playerSlice';
import { useAppDispatch, useAppSelector } from '../../hooks';

import View from '../../components/View/View';

import './Settings.scss';
import '../../styles/_components.scss';

import spotifyLogo from '../../../../assets/service-icons/Spotify_Logo_RGB_White.png';
import appleMusicIcon from '../../../../assets/service-icons/Apple_Music_Icon_W.svg';

const Settings: React.FC = () => {
	const selectedOutputDevice = useAppSelector(selectOutputDeviceId);

	const [audioDevices, setOutputDevices] = useState<MediaDeviceInfo[]>();

	const dispatch = useAppDispatch();

	const getOutputDevices = async () => {
		const mediaDevices = await navigator.mediaDevices.enumerateDevices();
		setOutputDevices(mediaDevices.filter((device) => device.kind === 'audiooutput'));
	};

	const onOutputDeviceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		dispatch(setOutputDevice(e.currentTarget.value));
	};

	useEffect(() => {
		getOutputDevices();
	}, []);

	return (
		<View title="Settings" id="settings">
			<div className="content">
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
				<a href="/" className="service-btn" id="spotify">
					Connect to <img src={spotifyLogo} alt="" />
				</a>
				<a href="/" className="service-btn" id="apple-music">
					Connect to <img src={appleMusicIcon} alt="" /> Apple Music
				</a>
			</div>
		</View>
	);
};

export default Settings;
