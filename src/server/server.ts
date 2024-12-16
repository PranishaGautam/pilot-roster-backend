// // ESM
import Fastify from 'fastify'
import fastifyPostgres from '@fastify/postgres';

import dotenv from 'dotenv';
dotenv.config()

const PORT = 5000;

const server = Fastify({
  logger: true
})


server.register(fastifyPostgres, {
    connectionString: process.env.POSTGRES_DB_CONNECTION
})

interface User {
    id: number;
    name: string;
    email: string;
    position: string;
}

// Default endpoint to check the server health
server.get('/', async (request, reply) => {
    const message = "Pilot Roster Application is up and running";
    reply.status(200).send({message});
})

  
server.get('/users', async (request, reply) => {
    const client  = await server.pg.connect();

    try {
        const { rows } = await client.query<User>("SELECT id, name, email, position FROM users");
        reply.send(rows);
    } catch (error) {
        server.log.error(error);
        reply.status(500).send({error: "Database query failed"});
    } finally {
        client.release();
    }
});

// Endpoint to get the user detail with the id
server.get<{Params: { id: string }}>('/user/:id', async (request, reply) => {

    const client = await server.pg.connect();
    const { id } = request.params;

    try {
        const { rows } = await client.query<User>("SELECT id, name, email, position FROM users WHERE id = $1", [id]);

        if (rows?.length === 0) {
            reply.status(404).send({error: `User Id: ${id} not found in the database`});
        } else if (rows?.length > 1) {
            reply.status(500).send({error: `Multiple users found with id: ${id}, which is not supposed to happen`});
        } else {
            reply.send(rows); // Send the single user record
        }
    } catch (error) {
        server.log.error(error);
        reply.status(500).send({error: `Database query failed`})
    } finally {
        client.release();
    }
})
  
server.listen({ port: PORT }, err => {
    if (err) throw err
    console.log(`server listening on ${PORT}`);
})