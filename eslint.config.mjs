import comments from '@eslint-community/eslint-plugin-eslint-comments/configs'
import js from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import { importX } from 'eslint-plugin-import-x'
import jsdoc from 'eslint-plugin-jsdoc'
import regexp from 'eslint-plugin-regexp'
import unicorn from 'eslint-plugin-unicorn'
import { defineConfig } from 'eslint/config'
import globals from 'globals'

export default defineConfig([
	{
		name: 'pec/ignores',
		ignores: [
			'**/dist/',
			'**/node_modules/',
			'**/package-lock.json',
			'**/yarn.lock',
			'**/pnpm-lock.yaml',
			'**/bun.lockb',
		],
	},

	{ files: ['**/*.{js,mjs,cjs}'],
		name: 'pec/language-setup',
		languageOptions: {
			globals: { ...globals.browser, ...globals.node },
			sourceType: 'module',
			ecmaVersion: 'latest',
			parserOptions: {
				sourceType: 'module',
				ecmaVersion: 'latest',
			},
		},
		linterOptions: { reportUnusedDisableDirectives: 2 },
	},

	// js
	{ files: ['**/*.{js,mjs,cjs}'], name: 'js/recommended', ...js.configs.recommended },

	// comments
	comments.recommended,

	// import
	{
		files: ['**/*.{js,mjs,cjs}'],
		name: 'import-x/standalone',
		plugins: { 'import-x': importX },
		rules: {
			'import-x/first': 'error',
			'import-x/no-duplicates': 'error',
			'import-x/no-mutable-exports': 'error',
			'import-x/no-named-default': 'error',
			'import-x/no-self-import': 'error',
			'import-x/newline-after-import': ['error', { count: 1 }],
		},
	},

	// jsdoc
	jsdoc.configs['flat/recommended'],

	// regexp
	{ files: ['**/*.{js,mjs,cjs}'], name: 'regexp/recommended', ...regexp.configs['flat/recommended'] },

	// unicorn
	{
		name: 'unicorn/standalone',
		plugins: { unicorn },
		rules: {
			'unicorn/consistent-empty-array-spread': 'error',
			'unicorn/error-message': 'error',
			'unicorn/filename-case': [
				'error',
				{
					cases: {
						kebabCase: true,
						snakeCase: true,
					},
				},
			],
			'unicorn/prefer-module': 'error',
			'unicorn/no-instanceof-builtins': 'error',
			'unicorn/prefer-node-protocol': 'error',
			'unicorn/prefer-number-properties': 'error',
			'unicorn/throw-new-error': 'error',
		},
	},

	// stylistic
	{ files: ['**/*.{js,mjs,cjs}'], name: '@stylistic/customize', ...stylistic.configs.customize({ indent: 'tab' }),
	},
])
