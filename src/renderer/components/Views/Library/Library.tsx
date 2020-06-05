import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { PlayerState } from '../../../reducers/playerReducer';
import { ListType, SongObject } from '../../../../types/DataTypes';

import PageHeading from '../../PageHeading/PageHeading';
import SongList from '../../SongList/SongList';

import './Library.scss';

interface LibraryProps {
    player: PlayerState;

    addToQueue: (song: SongObject) => void;
}

interface LibraryState {
    queue: Array<SongObject>;
}

class Library extends React.Component<LibraryProps, LibraryState> {
    componentDidUpdate() {
        // console.log(this.props.player.queue);
    }

    testQueue = () => {
        for (let index = 0; index < 10; index += 1) {
            this.props.addToQueue({ ID: index, title: 'Track', artist: 'Band' });
        }
    };

    render() {
        return (
            <div id="library-container">
                <PageHeading title="Library" />
                <SongList />
                <SongList list={this.props.player.queue} type={ListType.QUEUE} />
                <button onClick={this.testQueue}>TEST QUEUE</button>
            </div>
        );
    }
}

export default Library;
