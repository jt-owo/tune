import { ReactElement, useCallback, useEffect, useRef } from 'react';
import useToggle from '../../hooks/useToggle';

import { HamburgerMenuItemProps } from './HamburgerMenuItem/HamburgerMenuItem';

import styles from './HamburgerMenu.module.scss';

interface HamburgerMenuProps {
	children?: ReactElement<HamburgerMenuItemProps>[];
	positionX: number;
	positionY: number;
	onClose: () => void;
	visible: boolean;
}

const HamburgerMenu = ({ children, onClose, visible, positionX, positionY }: HamburgerMenuProps): JSX.Element | null => {
	const [isFading, toggleFading] = useToggle();

	const ref = useRef<HTMLDivElement>(null);

	const handleCancel = useCallback(() => {
		setTimeout(() => {
			toggleFading();
			onClose();
		}, 100);
		toggleFading();
	}, [onClose, toggleFading]);

	useEffect(() => {
		const checkIfClickedOutside = (e: Event) => {
			// If the menu is open and the clicked target is not within the menu, call the cancel callback
			if (visible && ref.current && !ref.current.contains(e.target as Node)) handleCancel();
		};

		document.addEventListener('mouseup', checkIfClickedOutside);

		return () => document.removeEventListener('mouseup', checkIfClickedOutside);
	}, [visible, handleCancel, onClose]);

	if (!visible) return null;

	return (
		<div className={`${styles.container} ${isFading ? styles.fading : styles.visible}`} ref={ref} style={{ top: positionY, right: positionX }}>
			<ul>{children}</ul>
		</div>
	);
};

export default HamburgerMenu;
