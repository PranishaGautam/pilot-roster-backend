import { FastifyInstance } from 'fastify';
import { User } from '../interfaces/users-interface';


async function UserRoutes (fastify: FastifyInstance) {
    
    fastify.get('/', async (request, reply) => {
        const client  = await fastify.pg.connect();

        try {
            const { rows } = await client.query<User>("SELECT * FROM users");
            reply.send(rows);
        } catch (error) {
            fastify.log.error(error);
            reply.status(500).send({error: "Database query failed"});
        } finally {
            client.release();
        }
    });

    // Endpoint to get the user detail with the id
    fastify.get<{Params: { id: string }}>('/user/:id', async (request, reply) => {
    
        const client = await fastify.pg.connect();
        const { id } = request.params;
    
        try {
            const { rows } = await client.query<User>("SELECT * FROM users WHERE id = $1", [id]);
    
            if (rows?.length === 0) {
                reply.status(404).send({error: `User Id: ${id} not found in the database. Fuck you`});
            } else if (rows?.length > 1) {
                reply.status(500).send({error: `Multiple users found with id: ${id}, which is not supposed to happen`});
            } else {
                reply.send(rows); // Send the single user record
            }
        } catch (error) {
            fastify.log.error(error);
            reply.status(500).send({error: `Database query failed`})
        } finally {
            client.release();
        }
    })
}

export default UserRoutes;
