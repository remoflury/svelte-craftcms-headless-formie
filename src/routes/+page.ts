import { PUBLIC_CMS_API } from '$env/static/public';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types.js';

const query = `
  query PageQuery($uri: String) {
  entry(uri: [$uri]) {
    id
    title

    ... on page_Entry {

      form {
        id
        handle
      }
    }
  }
}
`;

type PageData = {
	entry: {
		id: string;
		title: string;
		form: {
			id: string;
			handle: string;
		}[];
	};
};

export const load: PageLoad = async ({ fetch }) => {
	const res = await fetch(PUBLIC_CMS_API, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			query,
			variables: {
				uri: '__home__'
			}
		})
	});

	if (!res.ok) {
		error(res.status, 'Error fetching data');
	}

	const {
		data,
		errors
	}: {
		data: PageData;
		errors: unknown;
	} = await res.json();

	if (errors) {
		console.error({ errors });
		error(400);
	}

	return {
		data: data.entry
	};
};
