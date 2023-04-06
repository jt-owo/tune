import '@testing-library/jest-dom';
import 'jest-canvas-mock';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../state/store';
import Application from '../ui/Application';

// Some components can't be tested simply because of the preload script in the window.

describe('Home', () => {
	it('should render', () => {
		expect(
			render(
				<Provider store={store}>
					<Application />
				</Provider>
			)
		).toBeTruthy();
	});
});
