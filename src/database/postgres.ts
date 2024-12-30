import fp from 'fastify-plugin';
import fastifyPostgres from '@fastify/postgres';

import dotenv from 'dotenv';
dotenv.config()

export default fp(async (fastify) => {
  // Connection to Database
  fastify.register(fastifyPostgres, {
      connectionString: process.env.POSTGRES_DB_CONNECTION
  });
})