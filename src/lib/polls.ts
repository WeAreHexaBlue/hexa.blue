export const POLL_VOTER_COOKIE = "hb_poll_voter";

export type PollOption = {
    id: number;
    label: string;
    position: number;
    votes: number;
};

export type PollArticle = {
    slug: string;
    title: string;
    locale: string;
};

export type Poll = {
    id: number;
    key: string;
    question: string;
    createdAt: string;
    endsAt: string | null;
    finished: boolean;
    options: PollOption[];
    totalVotes: number;
    myOptionId: number | null;
    article?: PollArticle;
};

export type PollRow = {
    id: number;
    poll_key: string;
    question: string;
    created_at: string;
    ends_at: string | null;
    finished: number;
    option_id: number;
    label: string;
    position: number;
    votes: number;
    my_option_id: number | null;
    article_slug?: string;
    article_title?: string;
    article_locale?: string;
};

export function groupPollRows(rows: PollRow[]): Poll[] {
    const polls = new Map<number, Poll>();

    for (const row of rows) {
        let poll = polls.get(row.id);

        if (!poll) {
            poll = {
                id: row.id,
                key: row.poll_key,
                question: row.question,
                createdAt: row.created_at,
                endsAt: row.ends_at,
                finished: row.finished === 1,
                options: [],
                totalVotes: 0,
                myOptionId: row.my_option_id,
                article:
                    row.article_slug && row.article_title && row.article_locale
                        ? {
                              slug: row.article_slug,
                              title: row.article_title,
                              locale: row.article_locale
                          }
                        : undefined
            };

            polls.set(row.id, poll);
        }

        poll.options.push({
            id: row.option_id,
            label: row.label,
            position: row.position,
            votes: row.votes
        });
        poll.totalVotes += row.votes;
    }

    return [...polls.values()];
}
