import pino from 'pino';

export const logger = pino({
    //redact option to now display sensitive information
    redact: ["DATABASE_CONNECTION"],
    //level:debug to use logger.debug
    level: 'debug',
    transport: {
        target: 'pino-pretty',
    }
})