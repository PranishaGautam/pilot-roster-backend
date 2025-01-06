"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Importing the variables from a central config file
const env_variables_1 = require("../config/env_variables");
const jwtSecret = env_variables_1.config.jwtSecret;
const bycryptSaltRounds = env_variables_1.config.bycryptSaltRounds;
const userQueries_1 = require("../queries/userQueries");
const opts = {
    schema: {
        response: {
            201: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    email: { type: 'string' },
                    role: { type: 'string' }
                }
            }
        }
    }
};
function AuthRoutes(fastify) {
    return __awaiter(this, void 0, void 0, function* () {
        // Endpoint for register
        fastify.post('/register', opts, (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const client = yield fastify.pg.connect();
            const { email, password, firstName, lastName, role } = request.body;
            const readQuery = (0, userQueries_1.getUserByEmail)(); // Calling the method to get the processed query
            const insertQuery = (0, userQueries_1.insertNewUser)(); // Calling the method to get the processed query
            try {
                // Check if email exists
                const { rows } = yield client.query(readQuery, [email]);
                if (rows.length > 0) {
                    return reply.status(409).send({ error: `Email already exists. Please try loginng in` });
                }
                const validRoles = ['admin', 'pilot'];
                // Validate the allowed role
                if (!validRoles.includes(role)) {
                    return reply.status(400).send({ error: `Invalid role. Allowed roles are: ${validRoles}` });
                }
                // Hash Passwords
                const hashedPassword = yield bcrypt_1.default.hash(password, bycryptSaltRounds);
                // Insert new record in the database
                const result = yield client.query(insertQuery, [firstName, lastName, email, hashedPassword, role]);
                const row = result.rows[0];
                // Send response
                return reply.status(201).send({ id: row.id, email: row.email, role: row.role });
            }
            catch (error) {
                fastify.log.error(error);
                reply.status(500).send({ error: `Internal server error` });
            }
            finally {
                client.release();
            }
        }));
        // Endpoint for login
        fastify.post('/login', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const client = yield fastify.pg.connect();
            const { email, password } = request.body;
            const query = (0, userQueries_1.getPasswordFromEmail)(); // Calling the method to get the processed query
            try {
                // Fetching user from the database
                const { rows } = yield client.query(query, [email]);
                if (rows.length === 0) {
                    reply.status(404).send({ error: `Username '${email}' not found in the database` });
                }
                const user = rows[0];
                // Validate password
                const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
                if (!isPasswordValid) {
                    return reply.status(401).send({ error: `Invalid credentials` });
                }
                // Generate JWT token
                const token = jsonwebtoken_1.default.sign({
                    userId: user.id,
                    userEmail: user.email,
                    role: user.role
                }, jwtSecret, {
                    expiresIn: '1h'
                });
                const response = { token, role: user.role };
                return reply.send(response);
            }
            catch (error) {
                fastify.log.error(error);
                reply.status(500).send({ error: `Internal server error` });
            }
            finally {
                client.release();
            }
        }));
    });
}
exports.default = AuthRoutes;
