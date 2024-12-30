import '@fastify/postgres';

declare module 'fastify' {
    interface FastifyInstance {
        pg:import('@fastify/postgres').PostgresDb;
    }
}