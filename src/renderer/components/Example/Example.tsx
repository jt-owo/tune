import * as React from 'react';

require('./Example.scss'); // Include Styles

const electron = window.require('electron');
const localPath = electron.remote.getGlobal('settings').path;

interface ExampleProps {
    message: string;
}

interface ExampleState {
    count: number;
}

class Example extends React.Component<ExampleProps, ExampleState> {
    state: ExampleState = {
        count: 0
    };

    render() {
        return (
            <div>
                Props Message: {this.props.message}
                <br />
                State Count: {this.state.count}
                <br />
                Path in Settings File: {localPath}
            </div>
        );
    }
}

export default Example;
