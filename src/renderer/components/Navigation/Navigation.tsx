/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import * as React from 'react';
import { NavLink } from 'react-router-dom';

require('./Navigation.scss');

const logo = '../../../../resources/images/logo.png';

const electron = window.require('electron');
const win = electron.remote.getCurrentWindow();

const Navigation: React.FunctionComponent<any> = () => (
    <nav id="nav-bar-div">
        <ul id="nav-bar">
            <li>
                <img src={logo} alt="logo" id="nav-bar-logo" draggable="false" />
            </li>
            <li>
                <NavLink
                    to="/home"
                    className="nav-btn btn-hover-animation"
                    id="home-btn"
                    draggable="false">
                    Home
                </NavLink>
            </li>
            <li>
                <NavLink
                    to="/browse"
                    className="nav-btn btn-hover-animation"
                    id="browse-btn"
                    draggable="false">
                    Browse
                </NavLink>
            </li>
            <li>
                <NavLink
                    to="/library"
                    className="nav-btn btn-hover-animation"
                    id="library-btn"
                    draggable="false">
                    Library
                </NavLink>
            </li>
            <li id="pinned-playlist-section">PLAYLISTS</li>
            <li>
                <NavLink
                    to="/settings"
                    className="nav-btn btn-hover-animation"
                    id="settings-btn"
                    draggable="false">
                    Settings
                </NavLink>
            </li>
        </ul>
    </nav>
);

export default Navigation;
