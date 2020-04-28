import { hot } from 'react-hot-loader/root';
import * as React from 'react';

import ExampleContainer from '../containers/ExampleContainer';

const Application = () => (
    <div>
        <ExampleContainer message="tune." />
    </div>
);

export default hot(Application);
