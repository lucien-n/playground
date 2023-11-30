import type { AuthClient, AuthSession } from '$lib/auth';

declare global {
	namespace App {
		interface Locals {
			auth: AuthClient;
			session: AuthSession | null;
		}
	}
}

export { };

