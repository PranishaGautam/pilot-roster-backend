import { FastifyRequest, FastifyReply } from "fastify";
import jwt from 'jsonwebtoken';

// Importing the jwtSecret from a central config file
import { config } from "../config/env_variables";
import { GetUserParams } from "../interfaces/users-interface";
const jwtSecret = config.jwtSecret;

interface DecodedToken {
    id: number;
    email: string;
    role: string;
}

export const authenticateAdmin = () => {
    return async (request: FastifyRequest, reply: FastifyReply) => {
        const authHeader = request.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return reply.status(401).send({error: "Unauthorized access"});
        }

        const token = authHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(token, jwtSecret) as DecodedToken;

            // Attaching the user information to the request object
            request.user = decoded;

            const { role } = decoded;

            if (role === 'admin') {
                return;
            }

            return reply.status(403).send({error: 'Access denied'});

        } catch (error) {
            return reply.status(401).send({error: 'Invalid or expired token', message: error});
        }
    } 
}

export const AuthenticateAdminOrCurrrentUser = () => {
    return async (request: FastifyRequest<{Params: GetUserParams}>, reply: FastifyReply) => {
        const authHeader = request.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return reply.status(401).send({error: "Unauthorized access"});
        }

        const token = authHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(token, jwtSecret) as DecodedToken;

            // Attaching the user information to the request object
            request.user = decoded;

            const { id, role } = decoded;

            const requestedUserId = request.params?.id ? parseInt(request.params?.id, 10) : null;

            if (role === 'admin' || (requestedUserId && id === requestedUserId)) {
                return;
            }

            return reply.status(403).send({error: 'Access denied'});

        } catch (error) {
            return reply.status(401).send({error: 'Invalid or expired token', message: error});
        }
    }
}