import { env } from "./config/env";
import {migrate} from "drizzle-orm/node-postgres/migrator"
import { logger } from "./utils/logger";
import { buildServer } from "./utils/server";
import { db } from "./db";

//to kill the ports on shutdowns of server
async function gracefulShutdown({
    app
}: {
    app: Awaited<ReturnType<typeof buildServer>>
}) {
    await app.close();
}


async function main() {
    const app = await buildServer();

    await app.listen({
        port: env.PORT,
        host: env.HOST
    })

    //migrate the new migrations to sync with the database
    await migrate(db, {
        migrationsFolder: "./migrations"
    })
    logger.debug(env);

    const signals = ['SIGINT', 'SIGTERM', 'SIGQUIT']
    for(const signal of signals) {
        process.on(signal, () => {
            gracefulShutdown({ app })
                .then(() => {
                    process.exit(0);
                })
                .catch((err) => {
                    console.error(err);
                    process.exit(1);
                })
        })
    }
}

main();