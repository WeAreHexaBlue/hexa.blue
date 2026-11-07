CREATE TABLE polls (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,

    article_id INTEGER NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    poll_key   TEXT    NOT NULL,

    question   TEXT    NOT NULL,
    ends_at    TEXT        NULL,

    created_at TEXT    NOT NULL DEFAULT (datetime('now')),

    UNIQUE(article_id, poll_key)
);

CREATE INDEX idx_polls_article ON polls(article_id);
CREATE INDEX idx_polls_ends ON polls(ends_at);

CREATE TABLE poll_options (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,

    poll_id  INTEGER NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
    position INTEGER NOT NULL,

    label    TEXT    NOT NULL,

    UNIQUE(poll_id, position)
);

CREATE INDEX idx_poll_options_poll ON poll_options(poll_id);

CREATE TABLE poll_votes (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,

    poll_id    INTEGER NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
    option_id  INTEGER NOT NULL REFERENCES poll_options(id) ON DELETE CASCADE,
    voter      TEXT    NOT NULL,

    created_at TEXT    NOT NULL DEFAULT (datetime('now')),

    UNIQUE(poll_id, voter)
);

CREATE INDEX idx_poll_votes_poll ON poll_votes(poll_id);
CREATE INDEX idx_poll_votes_option ON poll_votes(option_id);
