import * as React from 'react';
import newGuid from '../../util';
import { useAppDispatch } from '../../hooks';
import { addAlert, AlertType } from '../../../state/slices/alertSlice';

import View from '../../components/View/View';

import './Library.scss';

const Library: React.FC = () => {
	const dispatch = useAppDispatch();

	const testAlert = (msg: string, type: AlertType) => {
		dispatch(
			addAlert({
				id: newGuid(),
				message: msg,
				type
			})
		);
	};

	return (
		<View title="Library" id="library">
			<div className="content">
				<button type="button" onClick={() => testAlert('This is a info message', 'info')}>
					Info Alert
				</button>
				<button type="button" onClick={() => testAlert('This is a success message', 'success')}>
					Success Alert
				</button>
				<button type="button" onClick={() => testAlert('This is a warn message', 'warn')}>
					Warn Alert
				</button>
				<button type="button" onClick={() => testAlert('This is a error message', 'error')}>
					Error Alert
				</button>
			</div>
		</View>
	);
};

export default Library;
