import '@fastify/postgres';
import 'fastify';

declare module 'fastify' {
    interface FastifyInstance {
        pg:import('@fastify/postgres').PostgresDb;
    }

    interface FastifyRequest {
        user?: {
            id: number;
            email: string;
            role: string;
        }
    }
}