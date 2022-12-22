/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import Modal, { ModalProps } from '../Modal/Modal';

interface DialogProps extends ModalProps {
	text?: string;
}

const Dialog: React.FC<DialogProps> = (props) => {
	const { isOpen, onClose, text } = props;

	const handleYesClick = () => {
		onClose();
	};

	const handleNoClick = () => {
		onClose();
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<span>{text}</span>
			<button onClick={handleYesClick}>Yes</button>
			<button onClick={handleNoClick}>No</button>
		</Modal>
	);
};

export default Dialog;
