import React from 'react';

import tuneLogo from '../../../../../assets/images/logo.png';

const ServiceSelector: React.FC = () => {
	return (
		<div id="service-selector">
			<img src={tuneLogo} alt="" draggable={false} />
		</div>
	);
};

export default ServiceSelector;
