import type { APIRoute } from 'astro';
import { siteOpenGraph } from '~/utils/openGraphImage';

export const GET: APIRoute = async () =>
	new Response(await siteOpenGraph(), {
		headers: { 'Content-Type': 'image/png' },
	});
