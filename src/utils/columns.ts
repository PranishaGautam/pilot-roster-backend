
export const selectColumns = (columns: Record<string, string>, selected: string[]): string => {
    return selected.map((column) => columns[column]).join(', ');
}