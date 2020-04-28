import * as React from 'react';

require('./Example.scss'); // Include Styles

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
                {this.props.message} {this.state.count}
            </div>
        );
    }
}

export default Example;
