/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import * as React from 'react';

require('./Song.scss');

export interface SongObject {
    ID: number;
    title?: string;
    artist?: string;
    album?: string;
    genre?: string;
    year?: number;
    artwork?: string;
    duration?: number;
    src?: string;
}

interface SongProps {
    onDragStart: (e: React.DragEvent, index: number) => void;
    onDragOver: (index: number) => void;
    onDragEnd: () => void;
    startSong: (song: SongObject) => void;
    song: SongObject;
    index: number;
    showOnly?: boolean;
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
                        {this.props.song.artist} - {this.props.song.title}
                    </span>
                </div>
            </li>
        );
    }
}

export default Song;
