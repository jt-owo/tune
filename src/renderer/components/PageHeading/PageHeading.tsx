import * as React from 'react';

import './PageHeading.scss';

interface PageHeadingProps {
    title: string;
}

const PageHeading: React.FunctionComponent<PageHeadingProps> = (props) => (
    <div id="page-heading">{props.title}</div>
);

export default PageHeading;
