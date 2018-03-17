import * as express from 'express';
import * as controller from '../controllers/player-pass-controller';
import { serverAuth } from '../../auth/server-auth';

const router: express.Router = express.Router();

router.route('/:playerLogin')
    .get(serverAuth.auth, controller.getOrGenerate)
    .post(serverAuth.auth, controller.validate)
    .delete(serverAuth.auth, controller.remove)

export = router;
