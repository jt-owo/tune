import { FC } from 'react';

import tuneLogo from '../../../../../assets/images/logo.png';

import style from './ServiceSelector.module.scss';

const ServiceSelector: FC = () => {
	return (
		<div className={style['service-selector']}>
			<img src={tuneLogo} alt="" draggable={false} />
		</div>
	);
};

export default ServiceSelector;
