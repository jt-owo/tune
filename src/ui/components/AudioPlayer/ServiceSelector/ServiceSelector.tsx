import tuneLogo from '../../../../../assets/images/logo.png';

import styles from './ServiceSelector.module.scss';

const ServiceSelector = (): JSX.Element => {
	return (
		<div className={styles['service-selector']}>
			<img src={tuneLogo} alt="" draggable={false} />
		</div>
	);
};

export default ServiceSelector;
