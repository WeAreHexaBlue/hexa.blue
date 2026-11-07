type NewsPubPUT = Partial<Omit<App.Article, "id" | "created_at" | "tags">> & {
    tags?: string[];
    polls?: {
        key: string;
        question: string;
        options: string[];
        ends_at?: string | null;
    }[];
    images?: {
        name: string;
        data: string;
    }[];
};
