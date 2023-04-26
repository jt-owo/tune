import { render } from '@testing-library/react';
import Titlebar from './Titlebar';

describe('Titlebar', () => {
	it('should render', () => {
		// Test if component renders correctly.
		expect(render(<Titlebar />)).toBeTruthy();
	});
});
