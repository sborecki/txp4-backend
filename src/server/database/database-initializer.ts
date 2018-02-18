import * as mongoose from 'mongoose';

export default function initDatabase(): void {
    mongoose.connect(getDatabaseConnectionString());

    var db: mongoose.Connection = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB: connection error:'));
    db.once('open', function () {
        console.log(`Successfully connected to MongoDB database`);
    });
}

function getDatabaseConnectionString(): string {
    return 'mongodb://txpapi:' + getPassword() + "@" + getHost() + ":" + getPort() + "/txpdb";
}

function getPassword(): string {
    return process.env.ENV_MONGODB_PASSWORD !== undefined ? process.env.ENV_MONGODB_PASSWORD : "txp";
}

function getHost(): string {
    return process.env.ENV_MONGODB_HOST !== undefined ? process.env.ENV_MONGODB_HOST : "localhost";
}

function getPort(): string {
    return process.env.ENV_MONGODB_PORT !== undefined ? process.env.ENV_MONGODB_PORT : "27017";
}