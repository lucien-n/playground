import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { auth } }) => {
	await auth.signOut();
	throw redirect(303, '/');
};
