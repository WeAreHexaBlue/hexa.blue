import { error, redirect } from "@sveltejs/kit";
import { POLL_VOTER_COOKIE } from "$lib/polls";

const VOTER_MAX_AGE = 60 * 60 * 24 * 365;

type PollRow = {
    finished: number;
};

function safeRedirect(value: string): string {
    const path = value.split("#")[0];

    if (
        !path.startsWith("/") ||
        path.startsWith("//") ||
        path.includes("\\") ||
        /[\u0000-\u001f]/.test(path)
    )
        return "/news";

    return path;
}

export async function POST({ request, cookies, platform, url }) {
    const form = await request.formData();
    const pollId = Number(form.get("poll"));
    const optionId = Number(form.get("option"));
    const back = safeRedirect(String(form.get("redirect") ?? "/news"));

    if (!Number.isInteger(pollId) || !Number.isInteger(optionId))
        throw error(400, "Invalid poll vote.");

    const db = platform!.env.DB;
    const poll = await db
        .prepare(
            `
            SELECT
                CASE
                    WHEN p.ends_at IS NOT NULL AND julianday(p.ends_at) <= julianday('now') THEN 1
                    ELSE 0
                END AS finished
            FROM polls p
            WHERE p.id = ?
            `
        )
        .bind(pollId)
        .first<PollRow>();

    if (!poll) throw error(404, "Poll not found.");
    if (poll.finished === 1) throw error(403, "This poll has ended.");

    const option = await db
        .prepare("SELECT id FROM poll_options WHERE id = ? AND poll_id = ?")
        .bind(optionId, pollId)
        .first<{ id: number }>();

    if (!option) throw error(400, "Invalid poll option.");

    let voter = cookies.get(POLL_VOTER_COOKIE);

    if (!voter || !/^[0-9a-f-]{36}$/i.test(voter)) {
        voter = crypto.randomUUID();
        cookies.set(POLL_VOTER_COOKIE, voter, {
            path: "/",
            httpOnly: true,
            sameSite: "lax",
            maxAge: VOTER_MAX_AGE,
            secure: url.protocol === "https:"
        });
    }

    await db
        .prepare(
            `
            INSERT INTO poll_votes (poll_id, option_id, voter)
            VALUES (?, ?, ?)
            ON CONFLICT(poll_id, voter) DO UPDATE SET
                option_id  = excluded.option_id,
                created_at = datetime('now')
            `
        )
        .bind(pollId, optionId, voter)
        .run();

    redirect(303, `${back}#poll-${pollId}`);
}
