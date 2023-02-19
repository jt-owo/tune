/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable react/button-has-type */
import { FC, useCallback, useEffect, useRef, useState } from 'react';

import style from './RenameDialog.module.scss';

interface RenameDialogProps {
	nameCB: (data: string) => void;
	onClose: () => void;
	visible: boolean;
	value?: string;
}

const RenameDialog: FC<RenameDialogProps> = (props) => {
	const { value, visible, nameCB, onClose } = props;

	const [isFading, setFading] = useState(false);

	const ref = useRef<HTMLDivElement>(null);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		nameCB((e.currentTarget[0] as HTMLInputElement).value);

		setTimeout(() => {
			setFading(false);
			onClose();
		}, 200);
		setFading(true);
	};

	const handleCancel = useCallback(() => {
		nameCB(value || '');

		setTimeout(() => {
			setFading(false);
			onClose();
		}, 200);
		setFading(true);
	}, [nameCB, onClose, value]);

	useEffect(() => {
		const checkIfClickedOutside = (e: Event) => {
			// If the menu is open and the clicked target is not within the menu, call the cancel callback
			if (visible && ref.current && !ref.current.contains(e.target as Node)) {
				handleCancel();
			}
		};

		document.addEventListener('mouseup', checkIfClickedOutside);

		return () => {
			// Clean up the event listener
			document.removeEventListener('mouseup', checkIfClickedOutside);
		};
	}, [visible, handleCancel, onClose]);

	if (!visible) return null;

	return (
		<div className={`${style.dialog} ${isFading ? style.fading : style.visible}`} ref={ref}>
			<form onSubmit={handleSubmit}>
				<input type="text" defaultValue={value} className="text-input-3" />
				<div className={style['button-container']}>
					<button className={style['confirm-btn']} type="submit">
						Rename
					</button>
					<button className={style['cancel-btn']} type="reset" onClick={handleCancel}>
						Cancel
					</button>
				</div>
			</form>
		</div>
	);
};

export default RenameDialog;
