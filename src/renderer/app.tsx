import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';

import { Console } from '../tools/log';

import Application from './components/Application';
import store from './store';

const mainElement = document.createElement('div');
document.body.appendChild(mainElement);

Console.initLog();

const render = (Component: () => JSX.Element) => {
    ReactDOM.render(
        <AppContainer>
            <Provider store={store}>
                <Component />
            </Provider>
        </AppContainer>,
        mainElement
    );
};

render(Application);
