import * as React from 'react';

require('./PageHeading.scss'); // Include Styles

const PageHeading: React.FunctionComponent<any> = props => (
    <div id="page-heading">{props.title}</div>
);

export default PageHeading;
