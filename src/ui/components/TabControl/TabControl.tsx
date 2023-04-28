import { ReactElement, useCallback, useState } from 'react';
import { TabItemProps } from './TabItem/TabItem';

import styles from './TabControl.module.scss';

interface TabControlProps {
	selectedTab?: string;
	children: ReactElement<TabItemProps>[];
}

const TabControl = ({ children, selectedTab }: TabControlProps): JSX.Element => {
	const [activeTab, setActiveTab] = useState(selectedTab || children[0].props.label);
	const handleActiveTab = useCallback((label: string) => setActiveTab(label), []);

	return (
		<div className={styles.tabcontrol}>
			<nav className={styles['tabcontrol-nav']}>
				<div className={styles['tabcontrol-selected']} />
				{children.map((child) => {
					return child.props.label ? (
						<div role="button" key={child.props.label} className={child.props.label === activeTab ? `${styles.tab} ${styles.active}` : styles.tab} onClick={() => handleActiveTab(child.props.label)}>
							{child.props.label}
						</div>
					) : null;
				})}
			</nav>
			<div className={styles['tabcontrol-content']}>{children.filter((child) => child.props.label === activeTab)}</div>
		</div>
	);
};

export default TabControl;
