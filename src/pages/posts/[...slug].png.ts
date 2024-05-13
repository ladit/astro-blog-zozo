import { getEntry } from 'astro:content';
import type { APIContext } from 'astro';
import { getPosts } from '~/utils/collection';
import { postOpenGraph } from '~/utils/openGraphImage';

export async function getStaticPaths() {
	return (await getPosts()).map((post) => ({
		params: { slug: post.slug },
	}));
}

export const GET = async ({ params }: APIContext) => {
	const post = await getEntry('posts', params.slug as string);
	return new Response(
		await postOpenGraph({
			title: post?.data.title ?? '',
			description: post?.data.description,
			tags: post?.data.tags,
		}),
		{
			headers: { 'content-type': 'image/png' },
		},
	);
};
