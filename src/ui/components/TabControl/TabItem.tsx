/* eslint-disable react/jsx-no-useless-fragment */
import { FC } from 'react';

export interface TabItemProps {
	// The label prop is used in the TabControl component
	// eslint-disable-next-line react/no-unused-prop-types
	label: string;
	children: JSX.Element | JSX.Element[];
}

const TabItem: FC<TabItemProps> = (props) => {
	const { children } = props;

	return <>{children}</>;
};

export default TabItem;
