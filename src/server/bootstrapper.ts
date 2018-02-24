import * as express from 'express';
import * as helmet from 'helmet';
import * as bodyParser from 'body-parser';
import initDatabase from './database/database-initializer';
import * as masterRouter from './api/routes/master-router';
import pageNotFoundHandler from './middlewares/page-not-found-handler';
import renderSinglePageApplicationHandler from './middlewares/render-single-page-application-handler';

export default class Bootstrapper {
    private application: express.Application;
    private port: number;

    public constructor() {
        this.application = express();
        this.setConfiguration();
        this.initDatabase();
        this.setSinglePageApplicationRoute();
        this.setRouters();
        this.setErrorHandlers();
    }

    public start(): void {
        this.application.listen(process.env.PORT || this.port, () => {
            // tslint:disable-next-line:no-console
            console.log(`Application is running at http://localhost:${this.port}.`);
        });
    }

    private setConfiguration(): void {
        this.port = 9090;
        this.application.set('view engine', 'pug');
        this.application.use(helmet());
        this.application.use(bodyParser.json());
    }

    private initDatabase(): void {
        initDatabase();
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
