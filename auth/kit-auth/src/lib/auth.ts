import type { RequestEvent } from '@sveltejs/kit';

type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
	{
		[K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
	}[Keys];

export type AuthCredentials = {
	username: string;
	password: string;
};

export type AuthUser = {
	uid: string;
	username: string;
};

export type AuthSession = {
	created_at: number;
	user: AuthUser;
};

type Response = {
	status: number;
	error?: string;
	data?: string;
};

export type ServerResponse = RequireAtLeastOne<Response, 'data' | 'error'>;

export type AuthClient = {
	login: (credentials: AuthCredentials) => Promise<ServerResponse>;
	getSession: () => Promise<AuthSession | null>;
	signOut: () => Promise<ServerResponse>;
};

export const createClient = (event: RequestEvent, url: string): AuthClient => {
	const { fetch, cookies } = event;

	const login = async (credentials: AuthCredentials) => {
		const res = await fetch(`${url}/auth`, {
			method: 'POST',
			body: JSON.stringify(credentials),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const { data, error } = await res.json();

		if (error) return { status: 500, error };

		const { token } = data;

		if (!token) return { status: 500, error: 'Internal-server-error' };

		cookies.set('session-token', token);

		return { status: 200, data: 'Logged in' };
	};

	const getSession = async () => {
		const sessionToken = cookies.get('session-token');

		if (!sessionToken) return null;

		const res = await fetch(`${url}/auth`, {
			method: 'GET',
			headers: {
				Authorization: sessionToken
			}
		});

		const { data, error } = await res.json();

		if (error) {
			console.error(error);
			return null;
		}

		return data as AuthSession;
	};

	const signOut = async () => {
		const sessionToken = cookies.get('session-token');

		if (!sessionToken) return { status: 401, data: 'You are not logged in' };

		const res = await fetch(`${url}/auth/signout`, {
			method: 'GET',
			headers: { Authorization: sessionToken }
		});

		const { error } = await res.json();

		if (error) return { status: 500, error };

		cookies.delete('session-token');

		return { status: 200, data: 'Signed out successfuly' };
	};

	return {
		login,
		getSession,
		signOut
	};
};
