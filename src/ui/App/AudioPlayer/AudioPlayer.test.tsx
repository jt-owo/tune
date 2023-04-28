import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../../../state/store';
import AudioPlayer from './AudioPlayer';

describe('AudioPlayer', () => {
	it('should render', () => {
		expect(
			render(
				<Provider store={store}>
					<AudioPlayer />
				</Provider>
			)
		).toBeTruthy();
	});
});
