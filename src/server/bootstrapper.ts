import * as express from 'express';
import * as helmet from 'helmet';
import * as mongoose from 'mongoose';
import * as masterRouter from './api/routes/master-router';
import pageNotFoundHandler from './middlewares/page-not-found-handler';
import renderSinglePageApplicationHandler from './middlewares/render-single-page-application-handler';


export default class Bootstrapper {
    private application: express.Application;
    private port: number;

    public constructor() {
        this.application = express();
        this.setConfiguration();
        this.setDatabase();
        this.setSinglePageApplicationRoute();
        this.setRouters();
        this.setErrorHandlers();
    }

    public start(): void {
        this.application.listen(this.port, () => {
            // tslint:disable-next-line:no-console
            console.log(`Application is running at http://localhost:${this.port}.`);
        });
    }

    private setConfiguration(): void {
        this.port = 9090;
        this.application.set('view engine', 'pug');
        this.application.use(helmet());
    }

    private setDatabase(): void {
        mongoose.connect(this.getDatabaseConnectionString());
        var db: mongoose.Connection = mongoose.connection;
        db.on('error', console.error.bind(console, 'MongoDB: connection error:'));
        db.once('open', function () {
            // tslint:disable-next-line:no-console
            console.log(`Successfully connected to MongoDB database`);
        });
    }

    private getDatabaseConnectionString(): string {
        return 'mongodb://'
            + "txpapi" + ":"
            + (process.env.ENV_MONGODB_PASSWORD !== undefined ? process.env.ENV_MONGODB_PASSWORD : "txp") + "@"
            + (process.env.ENV_MONGODB_HOST !== undefined ? process.env.ENV_MONGODB_HOST : "localhost") + ":"
            + (process.env.ENV_MONGODB_PORT !== undefined ? process.env.ENV_MONGODB_PORT : "27017")
            + "/txpdb";
    }

    private setSinglePageApplicationRoute(): void {
        this.application.get('/', renderSinglePageApplicationHandler);
    }

    private setErrorHandlers(): void {
        this.application.use(pageNotFoundHandler);
    }

    private setRouters(): void {
        this.application.use('/api', masterRouter);
    }
}
