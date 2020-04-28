import { hot } from 'react-hot-loader/root';
import * as React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import TitleBar from './TitleBar/TitleBar';
import Navigation from './Navigation/Navigation';
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
        <BrowserRouter>
            <div>
                <Navigation />
            </div>
        </BrowserRouter>
    </div>
);

export default hot(Application);
