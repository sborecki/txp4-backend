import * as express from 'express';
import * as controller from '../controllers/session-controller';
import * as auth from '../../auth/auth-module';

const router: express.Router = express.Router();

router.route('/')
    .get(auth.serverAuth, controller.get)
    .delete(auth.serverAuth, controller.reset);

router.route('/set-txp-multipiler')
    .post(auth.serverAuth, controller.setTxpMultipiler);

router.route('/set-perf-part-rarity')
    .post(auth.serverAuth, controller.setPerfPartRarityMultipiler);

export = router;
