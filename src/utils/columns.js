"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectColumns = void 0;
const selectColumns = (columns, selected) => {
    return selected.map((column) => columns[column]).join(', ');
};
exports.selectColumns = selectColumns;
