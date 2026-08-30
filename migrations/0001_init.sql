CREATE TABLE articles (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,

    slug       TEXT    NOT NULL,
    locale     TEXT    NOT NULL,

    title      TEXT    NOT NULL,
    author     TEXT    NOT NULL,
    body       TEXT    NOT NULL,
    short      TEXT        NULL,

    created_at TEXT    NOT NULL,

    UNIQUE(slug, locale)
);

CREATE INDEX idx_articles_locale_created ON articles(locale, created_at DESC);