import * as React from 'react';
import { AlertType } from '../../../../state/slices/alertSlice';

interface AlertIconProps {
	type: AlertType;
}

const AlertIcon: React.FC<AlertIconProps> = (props) => {
	const { type } = props;

	switch (type) {
		case 'info':
			return <div />;
		case 'warn':
			return <div />;
		case 'error':
			return <div />;
		case 'success':
			return <div />;
		default:
			return <div />;
	}
};

export default AlertIcon;
