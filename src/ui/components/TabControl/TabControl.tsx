/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { FC, ReactElement, useCallback, useState } from 'react';
import { TabItemProps } from './TabItem/TabItem';

import style from './TabControl.module.scss';

interface TabControlProps {
	selectedTab?: string;
	children: ReactElement<TabItemProps>[];
}

const TabControl: FC<TabControlProps> = (props) => {
	const { children, selectedTab } = props;

	const [activeTab, setActiveTab] = useState(selectedTab || children[0].props.label);
	const handleActiveTab = useCallback((label: string) => setActiveTab(label), []);

	return (
		<div className={style.tabcontrol}>
			<nav className={style['tabcontrol-nav']}>
				<div className={style['tabcontrol-selected']} />
				{children.map((child) => {
					return child.props.label ? (
						<div role="button" key={child.props.label} className={child.props.label === activeTab ? `${style.tab} ${style.active}` : style.tab} onClick={() => handleActiveTab(child.props.label)}>
							{child.props.label}
						</div>
					) : null;
				})}
			</nav>
			<div className={style['tabcontrol-content']}>{children.filter((child) => child.props.label === activeTab)}</div>
		</div>
	);
};

export default TabControl;
