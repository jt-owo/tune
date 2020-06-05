/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import * as React from 'react';
import * as fs from 'fs';

import Song, { SongObject } from '../Song/Song';

require('./SongList.scss');

interface SongListProps {
    list?: Array<SongObject>;
}

interface SongListState {
    list: Array<SongObject>;
}

class SongList extends React.Component<SongListProps, SongListState> {
    state: SongListState = {
        list: [
            {
                ID: 1,
                title: 'Track',
                artist: 'Band',
                album: 'Album',
                genre: 'Genre',
                year: 2019,
                artwork: 'pathToImage',
                duration: 600,
            },
            {
                ID: 2,
                title: 'Track',
                artist: 'Band',
                album: 'Album',
                genre: 'Genre',
                year: 2019,
                artwork: 'pathToImage',
                duration: 600,
            },
            {
                ID: 3,
                title: 'Track',
                artist: 'Band',
                album: 'Album',
                genre: 'Genre',
                year: 2019,
                artwork: 'pathToImage',
                duration: 600,
            },
        ],
    };

    private draggedItem: any;

    private draggedIndex?: number;

    constructor(props: SongListProps) {
        super(props);
        if (this.props.list !== undefined) {
            this.state.list = this.props.list;
        }
    }

    /**
     * Sets the current item to dragged and add drag effect
     * @param {React.DragEvent} e - Event Object to handle the drag
     * @param {number} index - Number of the current items position in the list
     */
    onDragStart = (e: React.DragEvent, index: number) => {
        this.draggedItem = this.state.list[index];
        e.dataTransfer!.effectAllowed = 'move';
        e.dataTransfer!.setData('text/html', 'drag');
    };

    /**
     * Handles the events when dragging with an item over another item
     * @param {number} - Number of the current items position in the list
     */
    onDragOver = (index: number) => {
        const draggedOverItem = this.state.list[index];

        if (this.draggedItem === draggedOverItem) {
            return;
        }

        const list = this.state.list.filter((song) => song !== this.draggedItem);
        list.splice(index, 0, this.draggedItem);

        this.setState({ list });
    };

    /**
     * Handles the drop
     */
    onDragEnd = () => {
        this.draggedIndex = undefined;
    };

    /**
     * Handles the click to start a song
     */
    startSong = (song: SongObject) => {
        // TODO: Implement
    };

    render() {
        return (
            <div id="song-list-container">
                <ul id="song-list">
                    {this.state.list.map((song: SongObject, index: number) => (
                        <Song
                            key={song.ID}
                            song={song}
                            index={index}
                            onDragOver={this.onDragOver}
                            onDragStart={this.onDragStart}
                            onDragEnd={this.onDragEnd}
                            startSong={this.startSong}
                            />
                    ))}
                </ul>
            </div>
        );
    }
}

export default SongList;
