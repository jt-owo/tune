/* eslint-disable jsx-a11y/click-events-have-key-events */
import { FC, useCallback } from 'react';
import { AlertType } from '../../../typings/types';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { removeAlert } from '../../../state/slices/alertSlice';
import AlertIcon from './AlertIcon/AlertIcon';

import style from './Alert.module.scss';
import useFadeOut from '../../hooks/useFadeOut';

interface AlertProps {
	id?: string;
	message: string;
	type: AlertType;
}

const Alert: FC<AlertProps> = (props) => {
	const { id, message, type } = props;

	const dispatch = useAppDispatch();

	const handleRemove = useCallback(() => {
		if (id) dispatch(removeAlert(id));
	}, [id, dispatch]);

	const [isFadingOut, fadeOut] = useFadeOut(handleRemove, true, 3000);

	return (
		<div className={`${isFadingOut ? style['fade-out'] : ''} ${style[type]} ${style.alert}`}>
			<div className={style['type-icon']}>
				<AlertIcon type={type} />
			</div>
			<div className={style.message}>{message}</div>
			<div className={style.closebtn} role="button" tabIndex={0} onClick={fadeOut}>
				X
			</div>
		</div>
	);
};

export const AlertContainer: FC = () => {
	const alerts = useAppSelector((state) => state.alerts.items);
	const nextAlert = alerts && alerts[0];
	return <div className={style['alerts-container']}>{nextAlert && nextAlert.id && <Alert key={nextAlert.id} {...nextAlert} />}</div>;
};

export default AlertContainer;
