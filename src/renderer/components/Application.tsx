import { hot } from 'react-hot-loader/root';
import * as React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import TitleBar from './TitleBar/TitleBar';
import Navigation from './Navigation/Navigation';
import PlayerContainer from '../containers/PlayerContainer';

import Home from './Views/Home/Home';
import Browse from './Views/Browse/Browse';
import LibraryContainer from '../containers/LibraryContainer';
import Settings from './Views/Settings/Settings';

import './Application.scss';

function LoadTitleBar() {
    if (process.platform !== 'darwin') {
        return <TitleBar />;
    }
    return <div id="macos-titlebar" />;
}

const Application = () => (
    <div id="app-container">
        <LoadTitleBar />
        <Router>
            <div>
                <Navigation />
                <Switch>
                    <Route path="/home" component={Home} exact />
                    <Route path="/browse" component={Browse} exact />
                    <Route path="/library" component={LibraryContainer} exact />
                    <Route path="/settings" component={Settings} exact />
                    <Redirect to="/home" />
                </Switch>
            </div>
        </Router>
        <PlayerContainer />
    </div>
);

export default hot(Application);
