import * as React from 'react';
import { useState, useEffect } from 'react';
import { setOutputDevice } from '../../../state/slices/playerSlice';

import View from '../../components/View/View';
import { useAppDispatch } from '../../hooks';

import './Settings.scss';

const Settings: React.FC = () => {
	const [audioDevices, setOutputDevices] = useState<MediaDeviceInfo[]>();
	const [selectedDevice, setSelectedDevice] = useState<string>();

	const dispatch = useAppDispatch();

	const getOutputDevices = async () => {
		const mediaDevices = await navigator.mediaDevices.enumerateDevices();
		setOutputDevices(mediaDevices.filter((device) => device.kind === 'audiooutput'));
	};

	const outputDeviceOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedDevice(e.currentTarget.value);
		dispatch(setOutputDevice(e.currentTarget.value));
	};

	useEffect(() => {
		getOutputDevices();
	}, []);

	return (
		<View title="Settings" id="settings">
			<div className="content">
				<select onChange={outputDeviceOnChange} value={selectedDevice}>
					{audioDevices &&
						audioDevices.map((device) => {
							return (
								<option key={device.deviceId} value={device.deviceId}>
									{device.deviceId.toLowerCase() === 'default' ? 'Default Audio Device' : device.label}
								</option>
							);
						})}
				</select>
			</div>
		</View>
	);
};

export default Settings;