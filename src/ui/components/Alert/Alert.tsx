/* eslint-disable jsx-a11y/click-events-have-key-events */
import { FC, useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { AlertData, removeAlert, selectAlerts } from '../../../state/slices/alertSlice';
import AlertIcon from './AlertIcon/AlertIcon';

import style from './Alert.module.scss';

interface AlertProps {
	alert: AlertData;
}

const Alert: FC<AlertProps> = (props) => {
	const { alert } = props;
	const [isFadingOut, setFadingOut] = useState(false);

	const dispatch = useAppDispatch();

	/**
	 * Sets {@link isFadingOut} to true and invokes the callback function {@link removeCB} with a 3 secound timeout.
	 * @param removeCB Function to invoke after fading out.
	 */
	const fadeOut = (removeCB: () => void) => {
		setTimeout(() => {
			removeCB();
		}, 300);
		setFadingOut(true);
	};

	const handleRemove = useCallback(() => {
		dispatch(removeAlert(alert.id));
	}, [alert.id, dispatch]);

	useEffect(() => {
		const timeID = setTimeout(() => {
			fadeOut(handleRemove);
		}, 3000);

		return () => {
			clearTimeout(timeID);
		};
	}, [handleRemove]);

	return (
		<div className={`${isFadingOut ? style['fade-out'] : ''} ${style[`${alert.type}`]} ${style.alert}`}>
			<div className={style['type-icon']}>
				<AlertIcon type={alert.type} />
			</div>
			<div className={style.message}>{alert.message}</div>
			<div className={style.closebtn} role="button" tabIndex={0} onClick={() => fadeOut(handleRemove)}>
				X
			</div>
		</div>
	);
};

export const AlertContainer: FC = () => {
	const alerts = useAppSelector(selectAlerts);
	const nextAlert = alerts && alerts[0];
	return <div className={style['alerts-container']}>{nextAlert && <Alert alert={nextAlert} key={nextAlert.id} />}</div>;
};

export default AlertContainer;
