/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { FC, ReactElement, useState, useEffect, useRef } from 'react';

import style from './DropdownMenu.module.scss';
import DropdownMenuItem, { DropdownMenuItemProps } from './DropdownMenuItem/DropdownMenuItem';

import arrowIcon from '../../../../assets/ui-icons/angle-down-solid-w.svg';

const ANIMATION_TIME = 100; // milliseconds

interface DropdownMenuProps {
	children: ReactElement<DropdownMenuItemProps>[] | undefined;
	value?: string;
	className?: string;
	onChange?: (current: string) => void;
}

const DropdownMenu: FC<DropdownMenuProps> = (props) => {
	const { children, value, onChange, className } = props;

	const [visible, setVisible] = useState(false);

	const ref = useRef<HTMLDivElement>(null);
	const listRef = useRef<HTMLDivElement>(null);

	const setListVisibility = (e: boolean) => {
		if (e) {
			setVisible(true);
			return;
		}

		if (listRef.current && !listRef.current.classList.contains(style.hide)) {
			listRef.current.classList.add(style.hide);

			setTimeout(() => {
				setVisible(false);
				if (listRef.current) {
					listRef.current.classList.remove(style.hide);
				}
			}, ANIMATION_TIME);
		}
	};

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
			if (visible && ref.current && !ref.current.contains(e.target as Node)) {
				setListVisibility(false);
			}
		};

		document.addEventListener('mouseup', checkIfClickedOutside);

		return () => {
			// Clean up the event listener
			document.removeEventListener('mouseup', checkIfClickedOutside);
		};
	}, [visible]);

	return (
		<div className={`${style.container} ${className}`} ref={ref}>
			<div className={style.selector} onClick={() => setListVisibility(!visible)}>
				<span>{getLabelFromValue()}</span>
				<img src={arrowIcon} alt="" />
			</div>
			{visible && (
				<div className={style.list} ref={listRef}>
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
