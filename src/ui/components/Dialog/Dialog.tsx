import useToggle from '../../hooks/useToggle';

import Modal, { ModalProps } from '../Modal/Modal';

import modalStyle from '../Modal/Modal.module.scss';

interface DialogProps extends ModalProps {
	type: 'default' | 'danger';
	confirmText: string;
	rejectText: string;
	heading: string;
	confirmCallback?: (confirm: boolean) => void;
	description?: string;
}

const Dialog = ({ visible: isOpen, onClose, heading, description, type, confirmText, rejectText, confirmCallback }: DialogProps): JSX.Element => {
	const [isFading, toggle] = useToggle();

	const handleYesClick = () => {
		setTimeout(() => {
			onClose();
			toggle();
		}, 100);
		toggle();
		if (confirmCallback) confirmCallback(true);
	};

	const handleNoClick = () => {
		setTimeout(() => {
			onClose();
			toggle();
		}, 100);
		toggle();
		if (confirmCallback) confirmCallback(false);
	};

	return (
		<Modal visible={isOpen} onClose={onClose} isFading={isFading}>
			<span className={modalStyle['modal-heading']}>{heading}</span>
			<span className={modalStyle['modal-description']}>{description}</span>
			<div className={modalStyle['modal-buttons-container']}>
				<button type="button" onClick={handleYesClick} className={modalStyle[type]}>
					{confirmText}
				</button>
				<button type="button" onClick={handleNoClick}>
					{rejectText}
				</button>
			</div>
		</Modal>
	);
};

export default Dialog;
