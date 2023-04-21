import { useCallback, useEffect, useRef } from 'react';
import useToggle from '../../hooks/useToggle';

import TextBox from '../TextBox/TextBox';

import styles from './RenameDialog.module.scss';

interface RenameDialogProps {
	cb: (name: string) => void;
	onClose: () => void;
	visible: boolean;
	value?: string;
}

const RenameDialog = ({ value, visible, cb, onClose }: RenameDialogProps): JSX.Element | null => {
	const [isFading, toggleFading] = useToggle();

	const ref = useRef<HTMLDivElement>(null);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		cb((e.currentTarget[0] as HTMLInputElement).value);

		setTimeout(() => {
			toggleFading();
			onClose();
		}, 200);
		toggleFading();
	};

	const handleCancel = useCallback(() => {
		cb(value || '');

		setTimeout(() => {
			toggleFading();
			onClose();
		}, 200);
		toggleFading();
	}, [cb, onClose, toggleFading, value]);

	useEffect(() => {
		const checkIfClickedOutside = (e: Event) => {
			// If the menu is open and the clicked target is not within the menu, call the cancel callback
			if (visible && ref.current && !ref.current.contains(e.target as Node)) handleCancel();
		};

		document.addEventListener('mouseup', checkIfClickedOutside);

		// Clean up the event listener
		return () => document.removeEventListener('mouseup', checkIfClickedOutside);
	}, [visible, handleCancel, onClose]);

	if (!visible) return null;

	return (
		<div className={`${styles.dialog} ${isFading ? styles.fading : styles.visible}`} ref={ref}>
			<form onSubmit={handleSubmit}>
				<TextBox size="large" defaultValue={value} />
				<div className={styles['button-container']}>
					<button className={styles['confirm-btn']} type="submit">
						Rename
					</button>
					<button className={styles['cancel-btn']} type="button" onClick={handleCancel}>
						Cancel
					</button>
				</div>
			</form>
		</div>
	);
};

export default RenameDialog;
