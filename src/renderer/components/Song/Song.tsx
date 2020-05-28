/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import * as React from 'react';

require('./Song.scss');

export interface SongObject {
    ID: number;
    title: string;
    artist: string;
    album: string;
    genre: string;
    year: number;
    artwork: string;
    duration: number;
}

class Song extends React.Component<any> {
    onDragStart = (e: React.DragEvent, index: number) => {
        this.props.onDragStart(e, index);
    };

    onDragOver = (index: number) => {
        this.props.onDragOver(index);
    };

    onDragEnd = () => {
        this.props.onDragEnd();
    };

    startSong = (e: React.DragEvent) => {
        this.props.startSong(e);
    };

    render() {
        return (
            <li
                className="song"
                key={this.props.item.ID}
                onDragOver={(e) => this.onDragOver(this.props.idx)}
                onClick={(e) => this.startSong(this.props.item)}>
                <div
                    className="drag"
                    draggable
                    onDragStart={(e) => this.onDragStart(e, this.props.idx)}
                    onDragEnd={this.onDragEnd}>
                    <span className="content">
                        {this.props.item.artist} - {this.props.item.title}
                    </span>
                </div>
            </li>
        );
    }
}

export default Song;
