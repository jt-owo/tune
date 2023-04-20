import { URL } from 'url';
import path from 'path';

class PathResolver {
	static resolveHtml = (htmlFileName: string) => {
		if (process.env.NODE_ENV === 'development') {
			const port = process.env.PORT || 9100;
			const url = new URL(`http://localhost:${port}`);
			url.pathname = htmlFileName;
			return url.href;
		}

		return `file://${path.resolve(__dirname, '../ui/', htmlFileName)}`;
	};
}

export default PathResolver;
