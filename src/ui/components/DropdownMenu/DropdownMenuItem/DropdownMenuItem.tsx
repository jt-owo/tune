/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import styles from './DropdownMenuItem.module.scss';

export interface DropdownMenuItemProps {
	label: string;
	value: string;
	selectCB?: (target: string) => void;
}

const DropdownMenuItem = ({ label, value, selectCB }: DropdownMenuItemProps) => {
	const handleSelect = () => {
		if (selectCB) selectCB(value);
	};

	return (
		<li className={styles.container} onClick={handleSelect}>
			{label}
		</li>
	);
};

export default DropdownMenuItem;
