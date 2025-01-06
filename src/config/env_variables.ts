import dotenv from 'dotenv';
dotenv.config();

const defaultJwtSecret = 'pilot_super_secret';
const defaultSaltRound = 10;

const getEnvVar = (key: string): string => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`${key} is not defined in the environment variables. Please add the config in the .env file or use another key`);
    }
    return value || '';
}

const parseEnvVarAsNumber = (key: string): number => {
    const value = getEnvVar(key);
    const parsed = parseInt(value, 10);
    if (isNaN(parsed)) {
        throw new Error(`${key} must be a valid number`);
    }
    return parsed;
}

export const config = {
    jwtSecret: getEnvVar('JWT_SECRET').length > 0 ? getEnvVar('JWT_SECRET') : defaultJwtSecret,
    bycryptSaltRounds: parseEnvVarAsNumber('SALT_ROUNDS') !== null ? parseEnvVarAsNumber('SALT_ROUNDS') : defaultSaltRound
}