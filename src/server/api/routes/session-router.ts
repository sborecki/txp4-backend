import * as express from 'express';
import * as controller from '../controllers/session-controller';
import { serverAuth } from '../../auth/server-auth';

const router: express.Router = express.Router();

router.route('/')
    .get(serverAuth.auth, controller.get)
    .delete(serverAuth.auth, controller.reset);

router.route('/set-txp-multipiler')
    .post(serverAuth.auth, controller.setTxpMultipiler);

router.route('/set-perf-part-rarity')
    .post(serverAuth.auth, controller.setPerfPartRarityMultipiler);

export = router;
