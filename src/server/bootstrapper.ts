import * as express from 'express';
import * as helmet from 'helmet';
import pageNotFoundHandler from './middlewares/page-not-found-handler';
import renderSinglePageApplicationHandler from './middlewares/render-single-page-application-handler';

export default class Bootstrapper {
    private application: express.Application;
    private port: number;

    public constructor() {
        this.application = express();

        this.setConfiguration();
        this.setSinglePageApplicationRoute();
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

    private setSinglePageApplicationRoute(): void {
        this.application.get('/', renderSinglePageApplicationHandler);
    }

    private setErrorHandlers(): void {
        this.application.use(pageNotFoundHandler);
    }
}
