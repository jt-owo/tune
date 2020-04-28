import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import Example from '../components/Example/Example';
import { RootState } from '../reducers';
import { ExampleAction, decrement, increment } from '../actions/exampleActions';

const mapStateToProps = (state: RootState) => ({
    value: state.counter.value
});

const mapDispatchToProps = (dispatch: Dispatch<ExampleAction>) => ({
    incrementValue: () => dispatch(increment()),
    decrementValue: () => dispatch(decrement())
});

export default connect(mapStateToProps, mapDispatchToProps)(Example);
