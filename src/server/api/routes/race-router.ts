import * as express from 'express';
import * as controller from '../controllers/race-controller';
import * as auth from '../../auth/auth-module';

const router: express.Router = express.Router();

router.route('/')
    .post(auth.serverAuth, controller.onRaceEnd);

export = router;
