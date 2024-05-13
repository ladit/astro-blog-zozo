import { statSync } from 'node:fs';
import { toString as mdToString } from 'mdast-util-to-string';
import getReadingTime from 'reading-time';

export function remarkPostTime() {
	return (_tree, { history, data }) => {
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
	return (tree, { data }) => {
		const frontmatter = data.astro.frontmatter;
		if (frontmatter.readingTime === undefined) {
			frontmatter.readingTime = getReadingTime(mdToString(tree));
		}
	};
}
