import { FastifyInstance } from 'fastify';
import UserRoutes from './users';
import AuthRoutes from './auth';

export default async function routes(fastify: FastifyInstance) {
    fastify.register(AuthRoutes, {prefix: '/api'});
    fastify.register(UserRoutes, {prefix: '/api/users'});
}