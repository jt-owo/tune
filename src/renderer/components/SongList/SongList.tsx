/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import * as React from 'react';
import * as fs from 'fs';

import Song, { SongObject } from '../Song/Song';

require('./SongList.scss');

interface SongListState {
    items: Array<SongObject>;
}

class SongList extends React.Component<any, SongListState> {
    state: SongListState = {
        items: [
            {
                ID: 1,
                title: 'Track [1]',
                artist: 'Band',
                album: 'Album',
                genre: 'Genre',
                year: 2019,
                artwork: 'pathToImage',
                duration: 600,
            },
            {
                ID: 2,
                title: 'Track [2]',
                artist: 'Band',
                album: 'Album',
                genre: 'Genre',
                year: 2019,
                artwork: 'pathToImage',
                duration: 600,
            },
            {
                ID: 3,
                title: 'Track [3]',
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

    UNSAFE_componentWillMount() {
        const songs: any = [];
        const localPath = '';
        if (localPath !== '') {
            fs.readdirSync(localPath).forEach((file) => {
                if (
                    file.substring(file.length - 4) === '.mp3' ||
                    file.substring(file.length - 5) === '.flac'
                ) {
                    songs.push(file.slice(0, -4));
                }
            });
            this.setState({ items: songs });
        }
    }

    /**
     * Sets the current item to dragged and add drag effect
     * @param {React.DragEvent} e - Event Object to handle the drag
     * @param {number} index - Number of the current items position in the list
     */
    onDragStart = (e: React.DragEvent, index: number) => {
        this.draggedItem = this.state.items[index];
        e.dataTransfer!.effectAllowed = 'move';
        e.dataTransfer!.setData('text/html', 'test');
    };

    /**
     * Handles the events when dragging with an item over another item
     * @param {number} - Number of the current items position in the list
     */
    onDragOver = (index: number) => {
        const draggedOverItem = this.state.items[index];

        if (this.draggedItem === draggedOverItem) {
            return;
        }

        const items = this.state.items.filter((item) => item !== this.draggedItem);
        items.splice(index, 0, this.draggedItem);

        this.setState({ items });
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
                    {this.state.items.map((song: SongObject, index: number) => (
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
