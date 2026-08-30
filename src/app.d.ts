// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		interface Platform {
			env: {
				DB: D1Database;
			};
		}

		interface Article {
			id: number,

			slug: string,
			locale: string,

			title: string,
			author: string,
			body: string,
			short: string,

			created_at: string,

			group_id: number
		}
	}
}

export {};
