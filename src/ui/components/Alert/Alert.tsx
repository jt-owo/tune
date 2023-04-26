/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useCallback } from 'react';
import { removeAlert } from '../../../state/slices/alertSlice';
import { useAppDispatch, useAppSelector } from '../../hooks';
import useFadeOut from '../../hooks/useFadeOut';

import AlertIcon from './AlertIcon/AlertIcon';

import styles from './Alert.module.scss';

interface AlertProps {
	id?: string;
	message: string;
	type: AlertType;
}

const Alert = ({ id, message, type }: AlertProps): JSX.Element => {
	const dispatch = useAppDispatch();

	const handleRemove = useCallback(() => {
		if (id) dispatch(removeAlert(id));
	}, [id, dispatch]);

	const [isFadingOut, fadeOut] = useFadeOut(handleRemove, true, 3000);

	return (
		<div className={`${isFadingOut ? styles['fade-out'] : ''} ${styles[type]} ${styles.alert}`}>
			<div className={styles['type-icon']}>
				<AlertIcon type={type} />
			</div>
			<div className={styles.message}>{message}</div>
			<div className={styles.closebtn} role="button" tabIndex={0} onClick={fadeOut}>
				X
			</div>
		</div>
	);
};

const AlertContainer = (): JSX.Element => {
	const alerts = useAppSelector((state) => state.alerts.items);
	const nextAlert = alerts && alerts[0];
	return <div className={styles['alerts-container']}>{nextAlert && nextAlert.id && <Alert key={nextAlert.id} {...nextAlert} />}</div>;
};

export default AlertContainer;
