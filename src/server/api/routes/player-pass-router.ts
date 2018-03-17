import * as express from 'express';
import * as controller from '../controllers/player-pass-controller';
import * as auth from '../../auth/auth-module';

const router: express.Router = express.Router();

router.route('/:playerLogin')
    .get(auth.serverAuth, controller.getOrGenerate)
    .post(auth.serverAuth, controller.validate)
    .delete(auth.serverAuth, controller.remove)

export = router;
