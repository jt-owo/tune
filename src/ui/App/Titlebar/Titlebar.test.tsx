import { render } from '@testing-library/react';
import TitleBar from './Titlebar';

describe('Titlebar', () => {
	it('should render', () => {
		// Test if component renders correctly.
		expect(render(<TitleBar />)).toBeTruthy();
	});
});
