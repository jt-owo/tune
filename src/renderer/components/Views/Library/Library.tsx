import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../../reducers';

import PageHeading from '../../PageHeading/PageHeading';
import SongList from '../../SongList/SongList';

import './Library.scss';

interface LibraryProps {
    playing: boolean;
}

class Library extends React.Component<LibraryProps> {
    componentDidUpdate() {
        // console.log(this.props.playing);
    }

    render() {
        return (
            <div id="library-container">
                <PageHeading title="Library" />
                <SongList />
            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    return {
        playing: state.player.playing,
    };
};

export default connect(mapStateToProps)(Library);
