import { FastifyInstance } from 'fastify';
import UserRoutes from './users';

export default async function routes(fastify: FastifyInstance) {
    fastify.register(UserRoutes, {prefix: '/api/users'});
}