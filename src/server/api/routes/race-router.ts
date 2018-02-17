import * as express from 'express';
import * as controller from '../controllers/race-controller';

const router: express.Router = express.Router();

router.route('/')
    .post(controller.onRaceEnd);

export = router;
