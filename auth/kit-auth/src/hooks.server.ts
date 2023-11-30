import { createClient as createAuthClient } from '$lib/auth';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const auth = createAuthClient(event, 'http://localhost:8080');

	event.locals.auth = auth;

	event.locals.session = await auth.getSession();

	if (event.url.pathname.startsWith('/protected') && !event.locals.session)
		return new Response(null, { status: 401 });

	return resolve(event);
};
