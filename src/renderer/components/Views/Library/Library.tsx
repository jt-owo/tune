import * as React from 'react';

import PageHeading from '../../PageHeading/PageHeading';

import './Library.scss';

class Library extends React.Component {
    componentDidMount() {
        // TODO: Add library functionality
    }

    render() {
        return (
            <div id="library-container">
                <PageHeading title="Library" />
            </div>
        );
    }
}

export default Library;
