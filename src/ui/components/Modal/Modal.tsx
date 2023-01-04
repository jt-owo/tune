/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { FC, useEffect } from 'react';
import Portal from '../Portal/Portal';

import './Modal.scss';

export interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	children?: JSX.Element | JSX.Element[];
}

const Modal: FC<ModalProps> = (props) => {
	const { children, isOpen, onClose } = props;

	useEffect(() => {
		const closeOnEscapeKey = (e: KeyboardEvent) => (e.key === 'Escape' ? onClose() : null);
		document.body.addEventListener('keydown', closeOnEscapeKey);
		return () => {
			document.body.removeEventListener('keydown', closeOnEscapeKey);
		};
	}, [onClose]);

	if (!isOpen) return null;

	return (
		<Portal wrapperID="portal-modal-container">
			<div className="modal">
				<div onClick={onClose} className="close-btn">
					Close
				</div>
				<div className="modal-content">{children}</div>
			</div>
		</Portal>
	);
};

export default Modal;
