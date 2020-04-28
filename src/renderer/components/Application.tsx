import { hot } from 'react-hot-loader/root';
import * as React from 'react';

import TitleBar from './TitleBar/TitleBar';
import ExampleContainer from '../containers/ExampleContainer';

require('./Application.scss');

function LoadTitleBar(props: any) {
    if (process.platform !== 'darwin') {
        return <TitleBar />;
    }
    return <div />;
}

const Application = () => (
    <div id="container">
        <LoadTitleBar />
        <ExampleContainer message="tune." />
    </div>
);

export default hot(Application);
