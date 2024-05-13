import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { Site } from '../config';

/*
gray-matter returns a file object with the following properties.

file.data {Object}: the object created by parsing front-matter
file.content {String}: the input string, with matter stripped
file.excerpt {String}: an excerpt, if defined on the options
file.empty {String}: when the front-matter is "empty" (either all whitespace, nothing at all, or just comments and no data), the original string is set on this property. See #65 for details regarding use case.
file.isEmpty {Boolean}: true if front-matter is empty.
 */

const directory = './src/content';

async function* walk(dir: string): AsyncGenerator<string> {
	for await (const d of await fs.promises.opendir(dir)) {
		const entry = path.join(dir, d.name);
		if (d.isDirectory()) {
			yield* walk(entry);
		} else if (d.isFile()) {
			yield entry;
		}
	}
}

interface MarkdownEntry {
	url: URL;
	path: string;
	file: matter.GrayMatterFile<string>;
}
export async function getMarkdownEntries(): Promise<MarkdownEntry[]> {
	const files = [];
	for await (const filePath of walk(directory)) {
		const ext = path.extname(filePath);
		if (ext !== '.md' && ext !== '.mdx') {
			continue;
		}
		const file = matter(await fs.promises.readFile(filePath, 'utf8'));
		const slug = (file.data.slug as string) ?? path.basename(filePath, ext);
		files.push({
			url: new URL(`/posts/${slug}`, Site),
			path: filePath,
			file: file,
		});
	}
	return files;
}
