import type { APIContext } from 'astro';
import rss from '@astrojs/rss';
import { getPosts } from '~/utils/collection';
import { SiteTitle, SiteDescription } from '~/config';

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
