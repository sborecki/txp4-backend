After successful mongoDB installation please open mongoDB shell and create any user/password, for example:
> use txppdb
> db.createUser({user: "txpapi", pwd: "txp", roles: [{role: "dbAdmin", db: "txpdb"}]})
You can use any password and host. However user, role and db must be "txpapi", "dbAdmin" and "txpdb" respectively.
Next, please set following environment variables:
ENV_MONGODB_PASSWORD
ENV_MONGODB_HOST
ENV_MONGODB_PORT
If not set app will use default connection string "mongodb://txp:txp@localhost:27017/txpdb".