import { hot } from 'react-hot-loader/root';
import * as React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import TitleBar from './TitleBar/TitleBar';
import Navigation from './Navigation/Navigation';
import Player from './Player/Player';

import Home from './Views/Home/Home';
import Browse from './Views/Browse/Browse';
import Library from './Views/Library/Library';
import Settings from './Views/Settings/Settings';

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
        <Router>
            <div>
                <Navigation />
                <Switch>
                    <Route path="/home" component={Home} exact />
                    <Route path="/library" component={Browse} exact />
                    <Route path="/browse" component={Library} exact />
                    <Route path="/settings" component={Settings} exact />
                </Switch>
            </div>
        </Router>
        <Player />
    </div>
);

export default hot(Application);
