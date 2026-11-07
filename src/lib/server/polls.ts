import { groupPollRows, type Poll, type PollRow } from "$lib/polls";

const POLL_COLUMNS = `
    p.id,
    p.poll_key,
    p.question,
    p.created_at,
    p.ends_at,
    CASE
        WHEN p.ends_at IS NOT NULL AND julianday(p.ends_at) <= julianday('now') THEN 1
        ELSE 0
    END AS finished,
    o.id AS option_id,
    o.label,
    o.position,
    (SELECT COUNT(*) FROM poll_votes v WHERE v.option_id = o.id) AS votes,
    (SELECT v.option_id FROM poll_votes v WHERE v.poll_id = p.id AND v.voter = ?) AS my_option_id
`;

export async function getArticlePolls(
    db: D1Database,
    articleId: number,
    voter: string
): Promise<Poll[]> {
    const { results } = await db
        .prepare(
            `
            SELECT ${POLL_COLUMNS}
            FROM polls p
            JOIN poll_options o ON o.poll_id = p.id
            WHERE p.article_id = ?
            ORDER BY p.created_at ASC, p.id ASC, o.position ASC
            `
        )
        .bind(voter, articleId)
        .all<PollRow>();

    return groupPollRows(results);
}

export async function getLocalePolls(
    db: D1Database,
    locale: string,
    voter: string
): Promise<Poll[]> {
    const { results } = await db
        .prepare(
            `
            SELECT ${POLL_COLUMNS},
                a.slug AS article_slug,
                a.title AS article_title,
                a.locale AS article_locale
            FROM polls p
            JOIN articles a ON a.id = p.article_id
            JOIN poll_options o ON o.poll_id = p.id
            WHERE a.locale = ?
            ORDER BY p.created_at DESC, p.id DESC, o.position ASC
            `
        )
        .bind(voter, locale)
        .all<PollRow>();

    return groupPollRows(results);
}
