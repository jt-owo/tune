import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { RootState } from '../reducers';

import Player from '../components/Player/Player';
import { PlayerAction, playPause } from '../actions/playerActions';

const mapStateToProps = (state: RootState) => ({
    playing: state.player.playing,
});

const mapDispatchToProps = (dispatch: Dispatch<PlayerAction>) => ({
    playPause: () => dispatch(playPause()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Player);
