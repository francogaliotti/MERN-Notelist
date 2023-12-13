export function formatDate(dateString: string, lan: string): string {
    return new Date(dateString).toLocaleString(`${lan}-US`,
        {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric"
        });
}