import getReadingTime from 'reading-time';
import { toString } from 'mdast-util-to-string';
import { statSync } from 'fs';

export function remarkPostTime() {
	return function (_tree, { history, data }) {
		const stat = statSync(history[0]);
		const frontmatter = data.astro.frontmatter;
		if (frontmatter.date === undefined) {
			frontmatter.date = stat.birthtime;
		}
		if (frontmatter.lastmod === undefined) {
			frontmatter.lastmod = stat.mtime;
		}
	};
}

export function remarkReadingTime() {
	return function (tree, { data }) {
		const frontmatter = data.astro.frontmatter;
		if (frontmatter.readingTime === undefined) {
			frontmatter.readingTime = getReadingTime(toString(tree));
		}
	};
}
