/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';

export interface ContextMenuItemProps {
	header: string;
	onClick?: () => void;
}

const ContextMenuItem: React.FC<ContextMenuItemProps> = (props) => {
	const { onClick, header } = props;

	return <li onClick={onClick}>{header}</li>;
};

export default ContextMenuItem;
