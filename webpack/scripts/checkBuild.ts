import path from 'path';
import chalk from 'chalk';
import fs from 'fs';
import webpackPaths from '../configs/webpack.paths';

const MAIN_PATH = path.join(webpackPaths.distMainPath, 'main.js');
const RENDERER_PATH = path.join(webpackPaths.distRendererPath, 'renderer.js');

if (!fs.existsSync(MAIN_PATH)) {
	throw new Error(chalk.whiteBright.bgRed.bold('The main process is not built yet. Build it by running "npm run build:main"'));
}

if (!fs.existsSync(RENDERER_PATH)) {
	throw new Error(chalk.whiteBright.bgRed.bold('The renderer process is not built yet. Build it by running "npm run build:renderer"'));
}
