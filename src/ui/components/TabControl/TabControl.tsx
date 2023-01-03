/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { FC, useCallback, useState } from 'react';
import { TabItemProps } from './TabItem';

import './TabControl.scss';

interface TabControlProps {
	selectedTab?: string;
	children: React.ReactElement<TabItemProps>[];
}

const TabControl: FC<TabControlProps> = (props) => {
	const { children, selectedTab } = props;

	const [activeTab, setActiveTab] = useState(selectedTab || children[0].props.label);
	const handleActiveTab = useCallback((label: string) => setActiveTab(label), []);

	return (
		<div className="tabcontrol">
			<nav className="tabcontrol-nav">
				{children.map((child) => {
					return child.props.label ? (
						<div role="button" key={child.props.label} className={child.props.label === activeTab ? 'tab active' : 'tab'} onClick={() => handleActiveTab(child.props.label)}>
							{child.props.label}
						</div>
					) : null;
				})}
			</nav>
			<div className="tabcontrol-content">{children.filter((child) => child.props.label === activeTab)}</div>
		</div>
	);
};

export default TabControl;
