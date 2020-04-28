import * as React from 'react';

import PageHeading from '../../PageHeading/PageHeading';

require('./Home.scss');

class Home extends React.Component {
    componentDidMount() {
        // TODO: Add home functionality
    }

    render() {
        return (
            <div id="home-container">
                <PageHeading title="Home" />
            </div>
        );
    }
}

export default Home;
