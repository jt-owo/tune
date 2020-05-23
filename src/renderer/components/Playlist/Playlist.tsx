/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import * as React from 'react';
import * as fs from 'fs';

import TrackList from '../TrackList/TrackList';
import Song from '../Song/Song';

require('./Playlist.scss');

const electron = window.require('electron');
const localPath = electron.remote.getGlobal('settings').path;

class Playlist extends TrackList {
    UNSAFE_componentWillMount() {
        const songs: any = [];
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
     * @param {Event} e - Event Object to handle the drag
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
        this.draggedIdx = undefined;
    };

    /**
     * Handles the click to start a song
     */
    startSong = (trackName: string) => {
        const track = `${localPath}${trackName}.mp3`;
    };

    render() {
        return (
            <div id="song-list-div">
                <ul id="song-list">
                    {this.state.items.map((item, idx) => (
                        <Song
                            key={item}
                            item={item}
                            idx={idx}
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

export default Playlist;
