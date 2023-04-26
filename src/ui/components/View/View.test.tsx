import { render, screen } from '@testing-library/react';
import View from './View';

describe('View', () => {
	it('should render', () => {
		// Test if component renders correctly.
		expect(
			render(
				<View id="test" title="Test">
					<div>This is view content</div>
				</View>
			)
		).toBeTruthy();

		// Test if title prop renders correctly.
		expect(screen.getByText(/Test/i)).toBeInTheDocument();

		// Test if childrens prop renders correctly.
		expect(screen.getByText(/This is view content/i)).toBeInTheDocument();
	});
});
