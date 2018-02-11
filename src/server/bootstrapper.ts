import * as express from 'express';

export default class Bootstrapper {
    private application: express.Application;

    public constructor() {
        this.application = express();

        this.setConfiguration();
        this.setSinglePageApplicationRoute();
    }

    public getApplication(): express.Application {
        return this.application;
    }

    private setConfiguration(): void {
        this.application.set('port', 9090);
        this.application.set('view engine', 'pug');
    }

    private setSinglePageApplicationRoute(): void {
        this.application.get('/', (request: express.Request, response: express.Response) => {
            response.render('index', {
                title: 'TrackMania Experience',
            });
        });
    }
}
