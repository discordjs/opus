import common from 'eslint-config-neon/common';
import node from 'eslint-config-neon/node';
import prettier from 'eslint-config-neon/prettier';

const res = [
	...common,
	...node,
	...prettier,
	{
		files: ['lib/**/*.js'],
		languageOptions: {
			ecmaVersion: 2_022,
			sourceType: 'commonjs',
		},
	},
];
export default res;
