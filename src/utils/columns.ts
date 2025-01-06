import TableSchemas from '../interfaces/schema-interface';

export const getSelectColumnsForTable = <T extends keyof TableSchemas, K extends keyof TableSchemas[T]>(table: T, columns: K[]): string => {
    return columns.join(", ");
}