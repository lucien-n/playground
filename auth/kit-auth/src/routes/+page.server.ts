import type { Actions } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ request, locals: { auth }, fetch }) => {
		const formData = await request.formData();

		const username = formData.get('username')?.toString() ?? '';
		const password = formData.get('password')?.toString() ?? '';

		if (!username || username.length < 3)
			return {
				error: 'Please enter a username of 3 characters minimum'
			};

		if (!password || password.length < 6)
			return {
				error: 'Please enter a password of 6 characters minimum'
			};

		try {
			const { error } = await auth.login({ username, password });

			if (error) {
				if (error === 'auth/user-not-found')
					return {
						error: `Could not find user '${username}'`
					};
				if (error === 'auth/wrong-credentials')
					return {
						error: 'Wrong credentials'
					};
			}
		} catch (e) {
			console.error(e);
		}

		return {
			error: ''
		};
	}
};
