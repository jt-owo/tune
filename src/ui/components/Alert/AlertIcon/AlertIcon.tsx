import Lottie from 'lottie-react';

import infoIcon from '../../../../../assets/animations/alertCircle.json';
import successIcon from '../../../../../assets/animations/checkmark.json';
import warnIcon from '../../../../../assets/animations/alertTriangle.json';

interface AlertIconProps {
	type: AlertType;
}

const AlertIcon = ({ type }: AlertIconProps): JSX.Element => {
	switch (type) {
		case 'info':
			return <Lottie animationData={infoIcon} className="lottie" />;
		case 'warn':
			return <Lottie animationData={warnIcon} className="lottie" />;
		case 'error':
			return <Lottie animationData={warnIcon} className="lottie" />;
		case 'success':
			return <Lottie animationData={successIcon} loop={false} className="lottie" />;
		default:
			return <div />;
	}
};

export default AlertIcon;
