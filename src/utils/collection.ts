import { getCollection } from 'astro:content';

export async function getPosts(hidden?: boolean, sortByDate?: string) {
	let allPosts = await getCollection('posts', ({ data }) => {
		if (typeof hidden === 'boolean') {
			return hidden ? data.hidden === true : data.hidden !== true;
		}
		return true;
	});
	if (sortByDate !== undefined) {
		if (sortByDate === 'asc') {
			allPosts = allPosts.sort((a, b) => {
				const aDate = a.data.lastmod ?? a.data.date;
				const bDate = b.data.lastmod ?? b.data.date;
				if (!aDate) {
					return -1;
				}
				if (!bDate) {
					return 1;
				}
				return aDate.valueOf() - bDate.valueOf();
			});
		} else {
			allPosts = allPosts.sort((a, b) => {
				const aDate = a.data.lastmod ?? a.data.date;
				const bDate = b.data.lastmod ?? b.data.date;
				if (!aDate) {
					return 1;
				}
				if (!bDate) {
					return -1;
				}
				return bDate.valueOf() - aDate.valueOf();
			});
		}
	}
	return allPosts;
}
