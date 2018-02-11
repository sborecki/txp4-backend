import Bootstrapper from './bootstrapper';
import * as express from 'express';

const bootstrapper: Bootstrapper = new Bootstrapper();
const application: express.Application = bootstrapper.getApplication();
const port: number = application.get('port');

application.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`Application is running at http://localhost:${port}.`);
});
