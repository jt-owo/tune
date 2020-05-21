import * as React from 'react';
import { connect } from 'react-redux';

import PageHeading from '../../PageHeading/PageHeading';
import TrackList from '../../TrackList/TrackList';
import Playlist from '../../Playlist/Playlist';
import DropArea from '../../DropArea/DropArea';

import './Library.scss';

class Library extends React.Component<any> {
    componentDidMount() {
        // TODO: Add library functionality
    }

    componentDidUpdate() {
        // console.log(this.props.player.status);
    }

    render() {
        return (
            <div id="library-container">
                <PageHeading title="Library" />
                <DropArea> </DropArea>
                <TrackList />
                <Playlist />
            </div>
        );
    }
}

const mapStateToProps = (state: any) => {
    return {
        player: state.player,
    };
};

export default connect(mapStateToProps)(Library);
