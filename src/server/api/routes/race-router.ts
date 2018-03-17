import * as express from 'express';
import * as controller from '../controllers/race-controller';
import { serverAuth } from '../../auth/server-auth';

const router: express.Router = express.Router();

router.route('/')
    .post(serverAuth.auth, controller.onRaceEnd);

export = router;
