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
                IMAGES: R2Bucket;
                PUBLISHER_TOKEN: string;
            };
        }

        interface PageData {
            /**
             * SEO hints provided by a page whose content is not available in
             * every locale (for example a news article).
             */
            seo?: {
                /** Locales in which this exact content exists. */
                languages?: string[];
            };
        }

        interface Article {
            id: number;

            slug: string;
            locale: string;

            title: string;
            author: string;
            body: string;
            short: string | null;

            tags: string;

            created_at: string;
        }
    }

    type Modify<
        T,
        KOmit extends keyof T = never,
        KNullable extends Exclude<keyof T, KOmit> = never
    > = Omit<T, KOmit | KNullable> & { [K in KNullable]: T[K] | null };
}

export {};
