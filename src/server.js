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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const postgres_db_connection_1 = __importDefault(require("./database/postgres_db_connection"));
const index_1 = __importDefault(require("./routes/index"));
const PORT = 5000;
const fastify = (0, fastify_1.default)({
    logger: true
});
// Default endpoint to check the server health
fastify.get('/', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const message = "Pilot Roster Application is up and running!!";
    reply.status(200).send({ message });
}));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        fastify.register(postgres_db_connection_1.default);
        // Regsiter the routes
        fastify.register(index_1.default);
        try {
            yield fastify.listen({ port: PORT });
            console.log(`server listening at localhost://${PORT}`);
        }
        catch (error) {
            console.error(error);
            process.exit(1);
        }
    });
}
main();
