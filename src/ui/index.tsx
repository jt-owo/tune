import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from '../state/store';
import Application from './Application';

const container = document.getElementById('root');
if (!container) {
	throw new Error('Root element was not found.');
}

const root = createRoot(container);
root.render(
	<Provider store={store}>
		<Application />
	</Provider>
);
