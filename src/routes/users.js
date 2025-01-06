"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const userQueries_1 = require("../queries/userQueries");
const auth_1 = require("../middleware/auth");
function UserRoutes(fastify) {
    return __awaiter(this, void 0, void 0, function* () {
        fastify.get('/', { preHandler: (0, auth_1.authenticateAdmin)() }, (_request, reply) => __awaiter(this, void 0, void 0, function* () {
            const client = yield fastify.pg.connect();
            const query = (0, userQueries_1.getAllUsers)(); // Calling the method to get the query
            try {
                const { rows } = yield client.query(query);
                const users = rows;
                reply.send(users);
            }
            catch (error) {
                fastify.log.error(error);
                reply.status(500).send({ error: "Database query failed" });
            }
            finally {
                client.release();
            }
        }));
        // Endpoint to get the user detail with the id
        fastify.get('/user/:id', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const client = yield fastify.pg.connect();
            const { id } = request.params; // Getting the path parameter
            const query = (0, userQueries_1.getUserById)(); // Calling the method to get the query
            try {
                const { rows } = yield client.query(query, [id]);
                if ((rows === null || rows === void 0 ? void 0 : rows.length) === 0) {
                    reply.status(404).send({ error: `User Id: ${id} not found in the database` });
                }
                else if ((rows === null || rows === void 0 ? void 0 : rows.length) > 1) {
                    reply.status(500).send({ error: `Multiple users found with id: ${id}, which is not supposed to happen` });
                }
                else {
                    const user = rows[0];
                    reply.send(user); // Send the single user record
                }
            }
            catch (error) {
                fastify.log.error(error);
                reply.status(500).send({ error: `Database query failed` });
            }
            finally {
                client.release();
            }
        }));
    });
}
exports.default = UserRoutes;
