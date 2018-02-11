import * as express from 'express';
import * as helmet from 'helmet';
import pageNotFoundHandler from './middlewares/page-not-found-handler';
import renderSinglePageApplicationHandler from './middlewares/render-single-page-application-handler';

export default class Bootstrapper {
    private application: express.Application;

    public constructor() {
        this.application = express();

        this.setConfiguration();
        this.setSinglePageApplicationRoute();
        this.setErrorHandlers();
    }

    public getApplication(): express.Application {
        return this.application;
    }

    private setConfiguration(): void {
        this.application.set('port', 9090);
        this.application.set('view engine', 'pug');
        this.application.use(helmet());
    }

    private setSinglePageApplicationRoute(): void {
        this.application.get('/', renderSinglePageApplicationHandler);
    }

    private setErrorHandlers(): void {
        this.application.use(pageNotFoundHandler);
    }
}
