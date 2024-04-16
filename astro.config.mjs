import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import { rehypeHeadingIds } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import compress from '@playform/compress';
import pagefind from 'astro-pagefind';
import emoji from 'remark-emoji';
import remarkMath from 'remark-math';
import toc from '@jsdevtools/rehype-toc';
import rehypeKatax from 'rehype-katex';
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis';
import rehypeExternalLinks from 'rehype-external-links';
import {
	transformerMetaHighlight,
	transformerMetaWordHighlight,
	transformerNotationDiff,
	transformerNotationErrorLevel,
	transformerNotationFocus,
	transformerNotationHighlight,
	transformerNotationWordHighlight,
} from '@shikijs/transformers';
import { Site } from './src/config';
import { getMarkdownEntries } from './src/utils/post';
import { transformerEnhanser } from './src/utils/shiki';
import { remarkReadingTime, remarkPostTime } from './src/utils/remark';

const excludeSitemapFiles = (await getMarkdownEntries()).filter((entry) => entry.file.data.hidden);

// https://astro.build/config
export default defineConfig({
	site: Site,
	build: {
		format: 'file',
	},
	integrations: [
		tailwind({
			applyBaseStyles: false,
		}),
		icon({
			iconDir: 'src/assets',
		}),
		pagefind(),
		sitemap({
			filter: (page) => !excludeSitemapFiles.some((entry) => entry.url.href === page),
		}),
		compress({
			CSS: {
				csso: false,
				lightningcss: {
					minify: true,
				},
			},
			HTML: true,
			Image: true,
			JavaScript: true,
			SVG: true,
			Parser: {
				CSS: 'lightningcss',
			},
		}),
	],
	prefetch: {
		defaultStrategy: 'tap',
	},
	markdown: {
		shikiConfig: {
			themes: {
				light: 'vitesse-light',
				dark: 'vitesse-dark',
			},
			// disable word wrap for horizontal scrolling
			wrap: false,
			// Add custom transformers: https://shiki.style/guide/transformers
			// Find common transformers: https://shiki.style/packages/transformers
			transformers: [
				transformerMetaHighlight(),
				transformerMetaWordHighlight(),
				transformerNotationDiff(),
				transformerNotationErrorLevel(),
				transformerNotationFocus(),
				transformerNotationHighlight(),
				transformerNotationWordHighlight(),
				transformerEnhanser(),
			],
		},
		remarkPlugins: [emoji, remarkMath, remarkPostTime, remarkReadingTime],
		rehypePlugins: [
			rehypeAccessibleEmojis,
			[rehypeExternalLinks, { target: '_blank' }],
			rehypeHeadingIds,
			toc,
			rehypeKatax,
		],
	},
});
