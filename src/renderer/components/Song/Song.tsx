/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import * as React from 'react';
import { ListType, SongObject } from '../../../types/DataTypes';

import RemoveButton from './RemoveButton/RemoveButton';

require('./Song.scss');

interface SongProps {
    song: SongObject;
    index: number;
    type?: ListType;
    removeFromQueue: (index: number) => void;
}

class Song extends React.Component<SongProps> {
    removeFromQueue = (index: number) => {
        this.props.removeFromQueue(index);
    };

    render() {
        return (
            <div>
                <span className="content">
                    {this.props.song.artist} - {this.props.song.title}
                </span>
                <RemoveButton songIndex={this.props.index} removeFromQueue={this.removeFromQueue} />
            </div>
        );
    }
}

export default Song;
