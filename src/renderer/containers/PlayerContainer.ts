import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import Player from '../components/Player/Player';
import { RootState } from '../reducers';
import { PlayerAction, playPause } from '../actions/playerActions';

const mapStateToProps = (state: RootState) => ({
    status: state.player.status,
});

const mapDispatchToProps = (dispatch: Dispatch<PlayerAction>) => ({
    playPause: () => dispatch(playPause()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Player);
