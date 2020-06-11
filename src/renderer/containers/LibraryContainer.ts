import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { RootState } from '../reducers';

import Library from '../components/Views/Library/Library';
import { PlayerAction, addToQueue } from '../actions/playerActions';
import { SongObject } from '../../types/DataTypes';

const mapStateToProps = (state: RootState) => {
    return {
        player: state.player,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<PlayerAction>) => ({
    addToQueue: (song: SongObject) => dispatch(addToQueue(song)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Library);
