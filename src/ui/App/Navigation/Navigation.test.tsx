import { render, screen } from '@testing-library/react';
import { MemoryRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../../../state/store';
import Navigation from './Navigation';

describe('Navigation', () => {
	it('should render', () => {
		// Test if component renders correctly.
		expect(
			render(
				<Provider store={store}>
					<Router>
						<Navigation />
					</Router>
				</Provider>
			)
		).toBeTruthy();

		// Test if nav buttons render correctly.
		expect(screen.getByText(/Home/i)).toBeInTheDocument();
		expect(screen.getByText(/Browse/i)).toBeInTheDocument();
		expect(screen.getByText(/Library/i)).toBeInTheDocument();
		expect(screen.getByText(/Settings/i)).toBeInTheDocument();
	});
});
