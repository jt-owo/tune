/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import * as React from 'react';
import * as fs from 'fs';

require('./TrackList.scss');

const electron = window.require('electron');
const localPath = electron.remote.getGlobal('settings').path;

interface TrackListState {
    items: Array<any>;
}

class TrackList extends React.Component<any, TrackListState> {
    state: TrackListState = {
        items: ['Track [1]', 'Track [2]', 'Track [3]', 'Track [4]'],
    };

    protected draggedItem: any;

    protected draggedIdx?: number;

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
     * Handles the click to start a song
     */
    startSong = (trackName: string) => {
        const track = `${localPath}${trackName}.mp3`;
    };

    render() {
        return (
            <div id="song-list-div">
                <ul id="song-list">
                    {this.state.items.map((item: string, idx: number) => (
                        <li key={item}>{item}</li>
                    ))}
                </ul>
            </div>
        );
    }
}

export default TrackList;
