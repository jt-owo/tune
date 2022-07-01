import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import Application from '../ui/Application';

describe('Application', () => {
	it('should render', () => {
		expect(render(<Application />)).toBeTruthy();
	});
});
