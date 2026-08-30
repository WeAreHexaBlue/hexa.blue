type NewsPubPOST = Modify<App.Article, "id" | "created_at", "author">;
type NewsPubPATCH = Omit<NewsPubPOST, "slug" | "locale">;