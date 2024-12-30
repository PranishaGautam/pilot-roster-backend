import Fastify from 'fastify';

import postgresPlugin from './database/postgres';
import routes from './routes/index';

const PORT = 5000;

const fastify = Fastify({
  logger: true
})

// Default endpoint to check the server health
fastify.get('/', async (request, reply) => {
    const message = "Pilot Roster Application is up and running!!";
    reply.status(200).send({message});
})

async function main() {

    fastify.register(postgresPlugin);

    // Regsiter the routes
    fastify.register(routes);

    try {
        await fastify.listen({ port: PORT });
        console.log(`server listening at localhost://${PORT}`);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

main();