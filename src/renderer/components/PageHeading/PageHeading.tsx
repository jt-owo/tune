import * as React from 'react';

import './PageHeading.scss';

const PageHeading: React.FunctionComponent<any> = (props) => (
    <div id="page-heading">{props.title}</div>
);

export default PageHeading;
