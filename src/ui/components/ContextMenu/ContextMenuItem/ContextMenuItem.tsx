/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import Lottie, { LottieComponentProps } from 'lottie-react';

import styles from './ContextMenuItem.module.scss';
import useLottie from '../../../hooks/useLottie';

interface ContextMenuItemDefaultProps {
	type: 'default' | 'danger';
	text: string;
	hidden?: boolean;
	active?: boolean;
	onClick?: () => void;
}

type ContextMenuItemConditionalProps =
	| {
			staticIcon?: string;
			lottieIcon?: never;
			hoverFrame?: never;
			activeFrame?: never;
	  }
	| {
			staticIcon?: never;
			lottieIcon?: LottieComponentProps['animationData'];
			hoverFrame?: number;
			activeFrame?: number;
	  };

export type ContextMenuItemProps = ContextMenuItemDefaultProps & ContextMenuItemConditionalProps;

const ContextMenuItem = ({ onClick, hidden, text, active, staticIcon, lottieIcon, hoverFrame, activeFrame, type }: ContextMenuItemProps): JSX.Element | null => {
	const [lottieRef, onMouseEnter, onMouseLeave] = useLottie({ hoverFrame, activeFrame, active });

	if (hidden || (!staticIcon && !lottieIcon)) return null;

	const renderIcon = () => {
		if (staticIcon) return <img src={staticIcon} alt="" />;
		if (lottieIcon) return <Lottie className={styles.lottie} animationData={lottieIcon} loop={false} lottieRef={lottieRef} />;
		return null;
	};

	return (
		<li onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} className={`${styles['context-menu-item']} ${styles[type]}`}>
			{renderIcon()}
			<div className={styles['context-menu-item-text']}>{text}</div>
		</li>
	);
};

export default ContextMenuItem;
