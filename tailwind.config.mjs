import typography from '@tailwindcss/typography';
import scrollbar from 'tailwind-scrollbar';
import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		fontFamily: {
			sans: ['"LXGW WenKai GB Screen"', ...defaultTheme.fontFamily.sans],
			serif: ['"LXGW WenKai GB Screen"', ...defaultTheme.fontFamily.serif],
			mono: ['Menlo', 'Consolas', ...defaultTheme.fontFamily.mono],
			'default-sans': defaultTheme.fontFamily.sans,
			'default-serif': defaultTheme.fontFamily.serif,
			'default-mono': defaultTheme.fontFamily.mono,
		},
	},
	plugins: [
		typography,
		scrollbar(),
		// taken from https://github.com/tailwindlabs/tailwindcss.com/blob/master/tailwind.config.js
		// function ({ addVariant }) {
		// 	addVariant('children', '& > *');
		// 	addVariant('supports-scrollbars', '@supports selector(::-webkit-scrollbar)');
		// 	addVariant('scrollbar', '&::-webkit-scrollbar');
		// 	addVariant('scrollbar-track', '&::-webkit-scrollbar-track');
		// 	addVariant('scrollbar-thumb', '&::-webkit-scrollbar-thumb');
		// },
	],
	darkMode: [
		'variant',
		[
			'@media (prefers-color-scheme: dark) { &:not(.light *) }',
			'&:is(.dark *)',
		],
	],
};
