/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import Lottie, { LottieComponentProps } from 'lottie-react';

import styles from './ContextMenuItem.module.scss';

interface ContextMenuItemDefaultProps {
	type: 'default' | 'danger';
	text: string;
	hidden?: boolean;
	onClick?: () => void;
}

type ContextMenuItemConditionalProps =
	| {
			staticIcon?: string;
			lottieIcon?: never;
	  }
	| {
			staticIcon?: never;
			lottieIcon?: LottieComponentProps['animationData'];
	  };

export type ContextMenuItemProps = ContextMenuItemDefaultProps & ContextMenuItemConditionalProps;

const ContextMenuItem = ({ onClick, hidden, text, staticIcon, lottieIcon, type }: ContextMenuItemProps): JSX.Element | null => {
	if (hidden || (!staticIcon && !lottieIcon)) return null;

	const renderIcon = () => {
		if (staticIcon) return <img src={staticIcon} alt="" />;
		if (lottieIcon) return <Lottie className={styles.lottie} animationData={lottieIcon} loop={false} />;
		return null;
	};

	return (
		<li onClick={onClick} className={`${styles['context-menu-item']} ${styles[type]}`}>
			{renderIcon()}
			<div className={styles['context-menu-item-text']}>{text}</div>
		</li>
	);
};

export default ContextMenuItem;
