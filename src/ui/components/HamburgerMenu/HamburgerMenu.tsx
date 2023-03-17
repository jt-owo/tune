import { FC, ReactElement, useCallback, useState, useEffect, useRef } from 'react';

import style from './HamburgerMenu.module.scss';
import { Props } from './HamburgerMenuItem/HamburgerMenuItem';

interface HamburgerMenuProps {
	children?: ReactElement<Props>[];
	positionX: number;
	positionY: number;
	onClose: () => void;
	visible: boolean;
}

const HamburgerMenu: FC<HamburgerMenuProps> = (props) => {
	const { children, onClose, visible, positionX, positionY } = props;

	const [isFading, setFading] = useState(false);

	const ref = useRef<HTMLDivElement>(null);

	const handleCancel = useCallback(() => {
		setTimeout(() => {
			setFading(false);
			onClose();
		}, 100);
		setFading(true);
	}, [onClose]);

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
		<div className={`${style.container} ${isFading ? style.fading : style.visible}`} ref={ref} style={{ top: positionY, right: positionX }}>
			<ul>{children}</ul>
		</div>
	);
};

export default HamburgerMenu;
