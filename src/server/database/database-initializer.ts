import * as mongoose from 'mongoose';

export default function initDatabase(): void {
    const connectionString: string = getDatabaseConnectionString();
    mongoose.connect(connectionString);
    const db: mongoose.Connection = mongoose.connection;
    // tslint:disable-next-line:no-console
    db.on('error', console.error.bind(console, `MongoDB: connection error:`));
    db.once('open', function() {
        // tslint:disable-next-line:no-console
        console.log(`Successfully connected to MongoDB database at ${getHost()}:${getPort()}`);
    });
}

function getDatabaseConnectionString(): string {
    if (process.env.ENV_MONGODB !== undefined) {
        return process.env.ENV_MONGODB;
    } else {
        return `mongodb://txpapi:${getPassword()}@${getHost()}:${getPort()}/txpdb`;
    }
}

function getPassword(): string {
    return process.env.ENV_MONGODB_PASSWORD !== undefined ? process.env.ENV_MONGODB_PASSWORD : `txp`;
}

function getHost(): string {
    return process.env.ENV_MONGODB_HOST !== undefined ? process.env.ENV_MONGODB_HOST : `localhost`;
}

function getPort(): string {
    return process.env.ENV_MONGODB_PORT !== undefined ? process.env.ENV_MONGODB_PORT : `27017`;
}
