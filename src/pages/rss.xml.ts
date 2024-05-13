import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SiteDescription, SiteTitle } from '~/config';
import { getPosts } from '~/utils/collection';

export async function GET(context: APIContext) {
	return rss({
		title: SiteTitle,
		description: SiteDescription,
		site: context.site ?? '',
		items: (await getPosts(false, 'desc')).map((post) => ({
			title: post.data.title,
			pubDate: post.data.lastmod ?? post.data.date,
			description: post.data.description ?? '',
			link: `/posts/${post.slug}`,
			content: post.body,
		})),
	});
}
