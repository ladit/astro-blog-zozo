import defaultTheme from 'tailwindcss/defaultTheme';
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		fontFamily: {
			sans: ['"LXGW WenKai GB Screen"', ...defaultTheme.fontFamily.sans],
			serif: ['"LXGW WenKai GB Screen"', ...defaultTheme.fontFamily.serif],
			mono: ['Menlo', 'Consolas', ...defaultTheme.fontFamily.mono],
		},
	},
	plugins: [typography],
	darkMode: [
		'variant',
		['@media (prefers-color-scheme: dark) { &:not(.light *) }', '&:is(.dark *)'],
	],
};
