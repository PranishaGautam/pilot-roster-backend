import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import { User, GetUserParams } from '../interfaces/users-interface';
import { getAllUsers, getUserByParameter } from '../queries/userQueries';
import { authenticateAdmin, AuthenticateAdminOrCurrrentUser } from '../middleware/auth';

async function UserRoutes (fastify: FastifyInstance) {
    
    fastify.get('/', { preHandler: authenticateAdmin() }, async (_request, reply: FastifyReply) => {

        const client  = await fastify.pg.connect();
        const query = getAllUsers(); // Calling the method to get the query

        try {
            const { rows } = await client.query(query);
            const users: User[] = rows;
            reply.send(users);
        } catch (error) {
            fastify.log.error(error);
            reply.status(500).send({error: "Database query failed"});
        } finally {
            client.release();
        }
    });

    // Endpoint to get the user detail with the id
    fastify.get('/user/:id', { preHandler: AuthenticateAdminOrCurrrentUser() }, async (request: FastifyRequest<{Params: GetUserParams}>, reply: FastifyReply) => {
    
        const client = await fastify.pg.connect();
        const { id } = request.params; // Getting the path parameter
        const query = getUserByParameter('insensitive', 'id'); // Calling the method to get the query
    
        try {
            const { rows } = await client.query(query, [id]);
    
            if (rows?.length === 0) {
                reply.status(404).send({error: `User Id: ${id} not found in the database`});
            } else if (rows?.length > 1) {
                reply.status(500).send({error: `Multiple users found with id: ${id}, which is not supposed to happen`});
            } else {
                const user: User = rows[0];
                reply.send(user); // Send the single user record
            }
        } catch (error) {
            fastify.log.error(error);
            reply.status(500).send({error: `Database query failed`})
        } finally {
            client.release();
        }
    });
}

export default UserRoutes;
