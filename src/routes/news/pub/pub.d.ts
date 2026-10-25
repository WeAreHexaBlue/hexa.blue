type NewsPubPUT = Partial<Omit<App.Article, "id" | "created_at" | "tags">> & {
    tags?: string[];
    images?: {
        name: string;
        data: string;
    }[];
};
