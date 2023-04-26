import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../../state/store';
import App from './App';

describe('Application', () => {
	it('should render', () => {
		expect(
			render(
				<Provider store={store}>
					<App />
				</Provider>
			)
		).toBeTruthy();
	});
});
