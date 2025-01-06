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
exports.authenticateAdmin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Importing the jwtSecret from a central config file
const env_variables_1 = require("../config/env_variables");
const jwtSecret = env_variables_1.config.jwtSecret;
const authenticateAdmin = () => {
    return (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        const authHeader = request.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return reply.status(401).send({ error: "Unauthorized access" });
        }
        const token = authHeader.split(' ')[1];
        try {
            const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
            // Attaching the user information to the request object
            request.user = decoded;
            const { role, id } = decoded;
            if (role === 'admin') {
                return;
            }
            return reply.status(403).send({ error: 'Access denied' });
        }
        catch (error) {
            return reply.status(401).send({ error: 'Invalid or expired token', message: error });
        }
    });
};
exports.authenticateAdmin = authenticateAdmin;
