/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import * as React from 'react';

import './TitleBar.scss';

const electron = window.require('electron');
const win = electron.remote.getCurrentWindow();

class TitleBar extends React.Component {
    minimize = () => {
        win.minimize();
    };

    maximize = () => {
        if (!win.isMaximized()) {
            win.maximize();
        } else {
            win.unmaximize();
        }
    };

    close = () => {
        win.close();
    };

    render() {
        return (
            <nav id="titlebar">
                <div id="titleShown">tune.</div>
                <div id="buttons">
                    <div id="minimize" role="button" onClick={this.minimize}>
                        <span>_</span>
                    </div>
                    <div id="maximize" role="button" onClick={this.maximize}>
                        <span>■</span>
                    </div>
                    <div id="close" role="button" onClick={this.close}>
                        <span>&times;</span>
                    </div>
                </div>
            </nav>
        );
    }
}

export default TitleBar;
