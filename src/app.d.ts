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
				PUBLISHER_TOKEN: string;
			};
		}

		interface Article {
			id: number,

			slug: string,
			locale: string,

			title: string,
			author: string,
			body: string,
			short?: string,

			created_at: string
		}
	}

	type Modify<
		T,
		KOmit extends keyof T = never,
		KOptional extends Exclude<keyof T, KOmit> = never
	> = Omit<T, KOmit | KOptional> & { [K in KOptional]?: T[K] };
}

export {};
