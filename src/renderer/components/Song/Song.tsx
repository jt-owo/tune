/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import * as React from 'react';
import { ListType, SongObject } from '../../../types/DataTypes';

require('./Song.scss');

interface SongProps {
    song: SongObject;
    index: number;
    showOnly?: boolean;
    type?: ListType;
    onDragStart: (e: React.DragEvent, index: number) => void;
    onDragOver: (index: number) => void;
    onDragEnd: () => void;
    startSong: (song: SongObject) => void;
}

class Song extends React.Component<SongProps> {
    onDragStart = (e: React.DragEvent, index: number) => {
        if (!this.props.showOnly) {
            this.props.onDragStart(e, index);
        }
    };

    onDragOver = (index: number) => {
        if (!this.props.showOnly) {
            this.props.onDragOver(index);
        }
    };

    onDragEnd = () => {
        if (!this.props.showOnly) {
            this.props.onDragEnd();
        }
    };

    startSong = (song: SongObject) => {
        if (!this.props.showOnly) {
            this.props.startSong(song);
        }
    };

    render() {
        return (
            <li
                className="song"
                key={this.props.song.ID}
                onDragOver={() => this.onDragOver(this.props.index)}
                onClick={() => this.startSong(this.props.song)}>
                <div
                    className="drag"
                    draggable
                    onDragStart={(e) => this.onDragStart(e, this.props.index)}
                    onDragEnd={this.onDragEnd}>
                    <span className="content">
                        {this.props.song.artist} - {this.props.song.title} [{this.props.song.ID}]
                    </span>
                </div>
            </li>
        );
    }
}

export default Song;
