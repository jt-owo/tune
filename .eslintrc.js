module.exports = {
	extends: ['airbnb', 'airbnb-typescript', 'airbnb/hooks', 'plugin:@typescript-eslint/recommended', 'plugin:jest/recommended', 'plugin:promise/recommended', 'plugin:compat/recommended', 'plugin:prettier/recommended'],
	rules: {
		'react/function-component-definition': 'off',
		'react/react-in-jsx-scope': 'off',
		'react/jsx-props-no-spreading': 'off',
		'react/require-default-props': 'off',
		'react/prop-types': 'off',
		'import/no-unresolved': 'error',
		'import/no-extraneous-dependencies': 'off',
		'import/no-named-as-default': 'off',
		'compat/compat': 'off',
		'jsx-a11y/media-has-caption': 'off'
	},
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module',
		project: './tsconfig.json',
		tsconfigRootDir: __dirname,
		createDefaultProgram: true
	},
	settings: {
		'import/resolver': {
			node: {},
			webpack: {
				config: require.resolve('./webpack/configs/webpack.config.eslint.ts')
			},
			typescript: {}
		},
		'import/parsers': {
			'@typescript-eslint/parser': ['.ts', '.tsx']
		}
	}
};
