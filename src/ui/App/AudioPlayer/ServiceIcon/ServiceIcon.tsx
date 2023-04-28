import tuneLogo from '../../../../../assets/images/logo.png';

import styles from './ServiceIcon.module.scss';

const ServiceIcon = (): JSX.Element => {
	return (
		<div className={styles['service-icon']}>
			<img src={tuneLogo} alt="" draggable={false} />
		</div>
	);
};

export default ServiceIcon;
