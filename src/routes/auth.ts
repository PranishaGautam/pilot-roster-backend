import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Importing the variables from a central config file
import { config } from '../config/env_variables';
const jwtSecret = config.jwtSecret;
const bycryptSaltRounds = config.bycryptSaltRounds;

import { getUserByEmail, getPasswordFromEmail, insertNewUser } from "../queries/userQueries";
import { UserRole, User } from "../interfaces/users-interface";
import { RegisterRequestBody, RegisterResponseBody, LoginRequestBody, LoginResponse } from "../interfaces/users-interface";


const opts = {
    schema: {
        response: {
            201: {
                type: 'object',
                properties: {
                    id: {type: 'string'},
                    email: {type: 'string'},
                    role: {type: 'string'}
                }
            }
        }
    }
}

async function AuthRoutes (fastify: FastifyInstance) {

    // Endpoint for register
    fastify.post('/register', opts, async (request: FastifyRequest<{Body: RegisterRequestBody}>, reply: FastifyReply) => {
        const client  = await fastify.pg.connect();
        const { email, password, firstName, lastName, role } = request.body;
        
        const readQuery = getUserByEmail(); // Calling the method to get the processed query
        const insertQuery = insertNewUser(); // Calling the method to get the processed query

        try {
            // Check if email exists
            const { rows } = await client.query(readQuery, [email]);
            if (rows.length > 0) {
                return reply.status(409).send({error: `Email already exists. Please try loginng in`});
            }

            const validRoles = ['admin', 'pilot']

            // Validate the allowed role
            if (!validRoles.includes(role)) {
                return reply.status(400).send({error: `Invalid role. Allowed roles are: ${validRoles}`});
            }


            // Hash Passwords
            const hashedPassword = await bcrypt.hash(password, bycryptSaltRounds);

            // Insert new record in the database
            const result = await client.query(insertQuery, [firstName, lastName, email, hashedPassword, role]);
            
            const row = result.rows[0];

            // Send response
            return reply.status(201).send({id: row.id, email: row.email, role: row.role});         
        } catch(error) {
            fastify.log.error(error);
            reply.status(500).send({error: `Internal server error`});
        } finally {
            client.release();
        }
    });

    // Endpoint for login
    fastify.post('/login', async (request: FastifyRequest<{Body: LoginRequestBody}>, reply: FastifyReply) => {

        const client  = await fastify.pg.connect();
        const { email, password } = request.body;
        const query = getPasswordFromEmail(); // Calling the method to get the processed query

        try {
            // Fetching user from the database
            const { rows } = await client.query(query, [email]);

            if (rows.length === 0) {
                reply.status(404).send({error: `Username '${email}' not found in the database`});
            }

            const user = rows[0];

            // Validate password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return reply.status(401).send({error: `Invalid credentials`});
            }


            // Generate JWT token
            const token = jwt.sign(
                {
                    userId: user.id, 
                    userEmail: user.email,
                    role: user.role
                },
                jwtSecret,
                {
                    expiresIn: '1h'
                }
            );
            
            const response: LoginResponse = { token, role: user.role };
            return reply.send(response);
        } catch(error) {
            fastify.log.error(error);
            reply.status(500).send({error: `Internal server error`});
        }  finally {
            client.release();
        }
    });

}

export default AuthRoutes;


