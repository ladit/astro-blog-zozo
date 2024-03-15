import { defineFlatConfig } from 'eslint-define-config';
import eslint from '@eslint/js';
import gitignore from 'eslint-config-flat-gitignore';
import eslintConfigPrettier from 'eslint-config-prettier';
import { FlatCompat } from '@eslint/eslintrc';
import globals from 'globals';
import typescriptESLint from '@typescript-eslint/eslint-plugin';
import typescriptESLintParser from '@typescript-eslint/parser';
import astroESLintParser from 'astro-eslint-parser';

/// <reference types="@eslint-types/typescript-eslint" />

/** @type {import("eslint-define-config").FlatESLintConfig[]} */
//  @ts-expect-error 无法将 Linter.FlatConfig 转换为 FlatESLintConfig
const extendedConfig = new FlatCompat().extends(
	'plugin:@typescript-eslint/recommended',
	'plugin:astro/recommended',
	'plugin:tailwindcss/recommended'
);

export default defineFlatConfig([
	gitignore(),
	{ ignores: ['**/*.d.ts'] },
	eslint.configs.recommended,
	...extendedConfig,
	defineFlatConfig({
		rules: {
			'no-console': 'error',
			'no-var': 'error',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					// Astro 隐式使用名为 Props 的类型作为 props 类型，因此即使不使用也无错误
					varsIgnorePattern: '(Props)|(^_)',
					argsIgnorePattern: '^_',
				},
			],
			'tailwindcss/no-custom-classname': 'off',
		},
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
			parser: typescriptESLintParser,
		},
		plugins: {
			// todo: typescript-eslint 不支持 flatConfig 并且类型不匹配，所以覆盖类型
			/** @type {Record<string, import("eslint").ESLint.Plugin>} */
			typescriptESLint,
		},
	}),
	defineFlatConfig({
		files: ['**/*.astro'],
		languageOptions: {
			parser: astroESLintParser,
			parserOptions: {
				parser: '@typescript-eslint/parser',
				extraFileExtensions: ['.astro'],
			},
		},
	}),
	eslintConfigPrettier,
]);
