/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { FC } from 'react';
import Modal, { ModalProps } from '../Modal/Modal';

interface DialogProps extends ModalProps {
	type: 'default' | 'danger';
	confirmText: string;
	rejectText?: string;
	heading?: string;
	description?: string;
}

const Dialog: FC<DialogProps> = (props) => {
	const { isOpen, onClose, heading, description, type, confirmText, rejectText } = props;

	const handleYesClick = () => {
		onClose();
	};

	const handleNoClick = () => {
		onClose();
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<span id="modal-heading">{heading}</span>
			<span id="modal-description">{description}</span>
			<div id="modal-buttons-container">
				<button onClick={handleYesClick} className={type}>
					{confirmText}
				</button>
				<button onClick={handleNoClick}>{rejectText}</button>
			</div>
		</Modal>
	);
};

export default Dialog;
