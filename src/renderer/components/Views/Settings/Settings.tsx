import * as React from 'react';

import PageHeading from '../../PageHeading/PageHeading';

require('./Settings.scss');

class Settings extends React.Component {
    componentDidMount() {
        // TODO: Add settings functionality
    }

    render() {
        return (
            <div id="settings-container">
                <PageHeading title="Settings" />
            </div>
        );
    }
}

export default Settings;
