/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useEffect } from 'react';
import Portal from '../Portal/Portal';

import styles from './Modal.module.scss';

export interface ModalProps {
	visible: boolean;
	onClose: () => void;
	isFading?: boolean;
	children?: JSX.Element | JSX.Element[];
}

const Modal = ({ children, visible, onClose, isFading }: ModalProps): JSX.Element | null => {
	useEffect(() => {
		const closeOnEscapeKey = (e: KeyboardEvent) => (e.key === 'Escape' ? onClose() : null);
		document.body.addEventListener('keydown', closeOnEscapeKey);
		return () => {
			document.body.removeEventListener('keydown', closeOnEscapeKey);
		};
	}, [onClose]);

	if (!visible) return null;

	return (
		<Portal wrapperID="portal-modal-container">
			<div className={styles.modal}>
				<div className={`${styles['modal-content']} ${isFading ? styles.fading : styles.visible}`}>{children}</div>
			</div>
		</Portal>
	);
};

export default Modal;
