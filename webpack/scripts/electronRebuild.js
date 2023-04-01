import fs from 'fs';
import { execSync } from 'child_process';
import { dependencies } from '../../release/app/package.json';
import webpackPaths from '../configs/webpack.paths';

if (Object.keys(dependencies || {}).length > 0 && fs.existsSync(webpackPaths.appNodeModulesPath)) {
	const rebuildCmd = '../../node_modules/.bin/electron-rebuild --force --types prod,dev,optional --module-dir .';
	const cmd = process.platform === 'win32' ? rebuildCmd.replace(/\//g, '\\') : rebuildCmd;
	execSync(cmd, {
		cwd: webpackPaths.appPath,
		stdio: 'inherit'
	});
}
