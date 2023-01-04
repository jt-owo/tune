/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { FC } from 'react';
import Lottie, { LottieComponentProps } from 'lottie-react';

import './ContextMenuItem.scss';

interface ContextMenuItemDefaultProps {
	type: 'default' | 'danger';
	header: string;
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

export type Props = ContextMenuItemDefaultProps & ContextMenuItemConditionalProps;

const ContextMenuItem: FC<Props> = (props) => {
	const { onClick, header, staticIcon, lottieIcon, type } = props;

	if (staticIcon && !lottieIcon) {
		return (
			<li onClick={onClick} id="context-menu-item" className={type}>
				<img src={staticIcon} alt="" />
				<div id="context-menu-item-text">{header}</div>
			</li>
		);
	}

	if (lottieIcon && !staticIcon) {
		return (
			<li onClick={onClick} id="context-menu-item" className={type}>
				<Lottie className="lottie" animationData={lottieIcon} loop={false} />
				<div id="context-menu-item-text">{header}</div>
			</li>
		);
	}

	return null;
};

export default ContextMenuItem;
