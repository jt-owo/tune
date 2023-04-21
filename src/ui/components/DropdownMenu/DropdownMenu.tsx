/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { ReactElement, useCallback, useEffect, useRef } from 'react';
import useToggle from '../../hooks/useToggle';

import DropdownMenuItem, { DropdownMenuItemProps } from './DropdownMenuItem/DropdownMenuItem';

import arrowIcon from '../../../../assets/ui-icons/angle-down-solid-w.svg';

import styles from './DropdownMenu.module.scss';

/** @const Time of the animation in miliseconds. */
const ANIMATION_TIME = 100;

interface DropdownMenuProps {
	children: ReactElement<DropdownMenuItemProps>[] | undefined;
	value?: string;
	className?: string;
	onChange?: (current: string) => void;
}

const DropdownMenu = ({ children, value, className, onChange }: DropdownMenuProps): JSX.Element => {
	const [isVisible, toggleVisibility] = useToggle();

	const ref = useRef<HTMLDivElement>(null);
	const listRef = useRef<HTMLDivElement>(null);

	const setListVisibility = useCallback(
		(e: boolean) => {
			if (e) {
				toggleVisibility();
				return;
			}

			if (listRef.current && !listRef.current.classList.contains(styles.hide)) {
				listRef.current.classList.add(styles.hide);

				setTimeout(() => {
					toggleVisibility();
					if (listRef.current) {
						listRef.current.classList.remove(styles.hide);
					}
				}, ANIMATION_TIME);
			}
		},
		[toggleVisibility]
	);

	const onSelect = (selected: string) => {
		if (onChange) {
			onChange(selected);
			setListVisibility(false);
		}
	};

	const getLabelFromValue = () => {
		if (children) {
			const child = children.find((x) => x.props.value === value);
			if (child) return child.props.label;
		}
		return null;
	};

	useEffect(() => {
		const checkIfClickedOutside = (e: MouseEvent) => {
			if (isVisible && ref.current && !ref.current.contains(e.target as Node)) setListVisibility(false);
		};

		document.addEventListener('mouseup', checkIfClickedOutside);

		// Clean up the event listener
		return () => document.removeEventListener('mouseup', checkIfClickedOutside);
	}, [setListVisibility, isVisible]);

	return (
		<div className={`${styles.container} ${className}`} ref={ref}>
			<div className={styles.selector} onClick={() => setListVisibility(!isVisible)}>
				<span>{getLabelFromValue()}</span>
				<img src={arrowIcon} alt="" />
			</div>
			{isVisible && (
				<div className={styles.list} ref={listRef}>
					{children &&
						children.map((child) => {
							return <DropdownMenuItem key={child.props.value} value={child.props.value} label={child.props.label} selectCB={onSelect} />;
						})}
				</div>
			)}
		</div>
	);
};

export default DropdownMenu;
