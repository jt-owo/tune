import chalk from 'chalk';
import path from 'path';
import rimraf from 'rimraf';
import webpackPaths from '../configs/webpack.paths';

export function deleteSourceMaps() {
	rimraf.sync(path.join(webpackPaths.distMainPath, '*.js.map'));
	rimraf.sync(path.join(webpackPaths.distRendererPath, '*.js.map'));
}

export function checkNodeEnv(expectedEnv) {
	if (!expectedEnv) {
		throw new Error('"expectedEnv" not set');
	}

	if (process.env.NODE_ENV !== expectedEnv) {
		console.log(chalk.whiteBright.bgRed.bold(`"process.env.NODE_ENV" must be "${expectedEnv}" to use this webpack config`));
		process.exit(2);
	}
}
