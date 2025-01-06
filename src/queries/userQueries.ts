import { getSelectColumnsForTable } from "../utils/columns";
import { User } from "../interfaces/users-interface";

// Defining the table name
const tableName = 'users';

// Defining the columns as an object for usage
const UserTableColumns = {
    id: 'id',
    first_name: 'first_name',
    last_name: 'last_name',
    email: 'email',
    password: 'password',
    role: 'role',
    start_date: 'start_date',
    end_date: 'end_date'
} as const;

// Defining the type of columns for the table
type UserColumns = keyof User;

const userTableAllColumns: UserColumns[] = ['id', 'first_name', 'last_name', 'email', 'password', 'role', 'start_date', 'end_date'];
const userTableSensitiveColumns: UserColumns[] = ['password'];
const allColumnsExcludingPassword = userTableAllColumns.filter((column) => !userTableSensitiveColumns.includes(column));

// Query to get the users by ID
export const getAllUsers = () => {
    const columns = getSelectColumnsForTable('users', allColumnsExcludingPassword);
    return `
        SELECT ${columns} 
        FROM ${tableName} 
        WHERE ${UserTableColumns.end_date} IS NULL OR ${UserTableColumns.end_date} > now();
    `
};

// Query to get User by Parameter
export const getUserByParameter = (requiredColumns: 'insensitive' | 'all', param: keyof User) => {
    
    let returningColumns: string;

    switch (requiredColumns) {
        case 'all':
            returningColumns = getSelectColumnsForTable('users', userTableAllColumns);
            break;
        case 'insensitive':
            returningColumns = getSelectColumnsForTable('users', allColumnsExcludingPassword);
            break;
        default:
            returningColumns = getSelectColumnsForTable('users', allColumnsExcludingPassword);
            break;
    }
    
    return `SELECT ${returningColumns} FROM ${tableName} WHERE ${param} =$1`;
}


// Query to add a record to the users table
export const insertNewUser = () => {
    const columns = getSelectColumnsForTable('users', userTableAllColumns);
    const returningColumns = getSelectColumnsForTable('users',  ['id', 'email', 'role'])
    return `
        INSERT INTO ${tableName} (${columns})
        VALUES (nextval('users_id_seq'::regclass), $1, $2, $3, $4, $5, NOW(), NULL)
        RETURNING ${returningColumns};
    `
}
