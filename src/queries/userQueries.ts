import { selectColumns } from "../utils/columns";
import { UserTableColumns } from "../database/columns";

// ***********************************************************************
// ***********************************************************************
// For reference to select column names from the file 'database/columns'

// userId: 'id',
// firstName: 'first_name',
// lastName: 'last_name',
// userEmail: 'email',
// userPassword: 'password',
// userRole: 'role',
// startDate: 'start_date',
// endDate: 'end_date'

// ***********************************************************************
// ***********************************************************************

const tableName = 'users';

const allColumns = ['userId', 'firstName', 'lastName', 'userEmail', 'userPassword', 'userRole', 'startDate', 'endDate'];
const sensitiveColumns = ['userPassword'];
const allColumnsExcludingPassword = allColumns.filter((column) => !sensitiveColumns.includes(column));

// Query to get the users by ID
export const getAllUsers = () => {
    const columns = selectColumns(UserTableColumns, allColumnsExcludingPassword);
    return `
        SELECT ${columns} FROM ${tableName}
    `
};

// Query to get a user by ID
export const getUserById = () => {
    const columns = selectColumns(UserTableColumns, allColumnsExcludingPassword);
    return `SELECT ${columns} FROM ${tableName} WHERE ${UserTableColumns.userId} = $1`
};
    
// Query to get a user by Email
export const getUserByEmail = () => {
    const columns = selectColumns(UserTableColumns, allColumnsExcludingPassword);
    return `SELECT ${columns} FROM ${tableName} WHERE ${UserTableColumns.userEmail} = $1`
}

export const getPasswordFromEmail = () => {
    const columns = selectColumns(UserTableColumns, ['userId', 'userEmail', 'userPassword', 'userRole']);
    return `SELECT ${columns} FROM ${tableName} WHERE ${UserTableColumns.userEmail} = $1`
}

// Query to add a record to the users table
export const insertNewUser = () => {
    const columns = selectColumns(UserTableColumns, allColumns);
    const returningColumns = selectColumns(UserTableColumns,  ['userId', 'userEmail', 'userRole'])
    return `
        INSERT INTO ${tableName} (${columns})
        VALUES (nextval('users_id_seq'::regclass), $1, $2, $3, $4, $5, NOW(), NULL)
        RETURNING ${returningColumns};
    `
}
