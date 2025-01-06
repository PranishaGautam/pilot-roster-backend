"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertNewUser = exports.getPasswordFromEmail = exports.getUserByEmail = exports.getUserById = exports.getAllUsers = void 0;
const columns_1 = require("../utils/columns");
const columns_2 = require("../database/columns");
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
const getAllUsers = () => {
    const columns = (0, columns_1.selectColumns)(columns_2.UserTableColumns, allColumnsExcludingPassword);
    return `
        SELECT ${columns} FROM ${tableName}
    `;
};
exports.getAllUsers = getAllUsers;
// Query to get a user by ID
const getUserById = () => {
    const columns = (0, columns_1.selectColumns)(columns_2.UserTableColumns, allColumnsExcludingPassword);
    return `SELECT ${columns} FROM ${tableName} WHERE ${columns_2.UserTableColumns.userId} = $1`;
};
exports.getUserById = getUserById;
// Query to get a user by Email
const getUserByEmail = () => {
    const columns = (0, columns_1.selectColumns)(columns_2.UserTableColumns, allColumnsExcludingPassword);
    return `SELECT ${columns} FROM ${tableName} WHERE ${columns_2.UserTableColumns.userEmail} = $1`;
};
exports.getUserByEmail = getUserByEmail;
const getPasswordFromEmail = () => {
    const columns = (0, columns_1.selectColumns)(columns_2.UserTableColumns, ['userId', 'userEmail', 'userPassword', 'userRole']);
    return `SELECT ${columns} FROM ${tableName} WHERE ${columns_2.UserTableColumns.userEmail} = $1`;
};
exports.getPasswordFromEmail = getPasswordFromEmail;
// Query to add a record to the users table
const insertNewUser = () => {
    const columns = (0, columns_1.selectColumns)(columns_2.UserTableColumns, allColumns);
    const returningColumns = (0, columns_1.selectColumns)(columns_2.UserTableColumns, ['userId', 'userEmail', 'userRole']);
    return `
        INSERT INTO ${tableName} (${columns})
        VALUES (nextval('users_id_seq'::regclass), $1, $2, $3, $4, $5, NOW(), NULL)
        RETURNING ${returningColumns};
    `;
};
exports.insertNewUser = insertNewUser;
