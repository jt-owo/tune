const fs = require('fs');

const splitLineIntoPairs = (line) => {
	const firstEqualSymbolPosition = line.search('=');
	const key = line.slice(0, firstEqualSymbolPosition).replaceAll(' ', '');
	const values = line.slice(firstEqualSymbolPosition + 1, line.length).replaceAll(' ', '');
	return {
		key,
		values
	};
};

const createEnvObj = (envByLines) => {
	return envByLines.map((line) => {
		const { key, values } = splitLineIntoPairs(line);
		return {
			key,
			values
		};
	});
};

const writeEnvToDistApp = ({ path, env }) => {
	let mainJs = fs.readFileSync(path).toString();
	env.forEach(({ key, values }) => {
		mainJs = mainJs.replace(`process.env.${key}`, `"${values}"`);
	});
	fs.writeFileSync(path, mainJs);
};

const packageEnv = () => {
	if (!fs.existsSync('./.env')) return;

	const envFileContent = fs.readFileSync('./.env').toString();
	const envByLines = envFileContent.split('\n').filter((line) => {
		return line !== '';
	});
	const envObj = createEnvObj(envByLines);
	writeEnvToDistApp({
		path: './release/app/dist/main/main.js',
		env: envObj
	});
};

packageEnv();
