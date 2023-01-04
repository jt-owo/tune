import { FC } from 'react';

import tuneLogo from '../../../../../assets/images/logo.png';

const ServiceSelector: FC = () => {
	return (
		<div id="service-selector">
			<img src={tuneLogo} alt="" draggable={false} />
		</div>
	);
};

export default ServiceSelector;
