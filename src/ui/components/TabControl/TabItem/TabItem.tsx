/* eslint-disable react/jsx-no-useless-fragment */
import { ReactNode } from 'react';

export interface TabItemProps {
	// The label prop is used in the TabControl component
	// eslint-disable-next-line react/no-unused-prop-types
	label: string;
	children: ReactNode;
}

const TabItem = ({ children }: TabItemProps): JSX.Element => {
	return <>{children}</>;
};

export default TabItem;
