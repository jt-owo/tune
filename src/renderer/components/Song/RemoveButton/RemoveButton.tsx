/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import * as React from 'react';

require('./RemoveButton.scss');

interface RemoveButtonProps {
    songIndex: number;
    removeFromQueue: (index: number) => void;
}

class RemoveButton extends React.Component<RemoveButtonProps> {
    remove = (index: number) => {
        this.props.removeFromQueue(index);
    };

    render() {
        return (
            <span className="removeButton" onClick={() => this.remove(this.props.songIndex)}>
                X
            </span>
        );
    }
}

export default RemoveButton;
