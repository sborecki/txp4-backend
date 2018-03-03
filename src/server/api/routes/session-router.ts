import * as express from 'express';
import * as controller from '../controllers/session-controller';

const router: express.Router = express.Router();

router.route('/')
    .get(controller.get)
    .delete(controller.reset);

router.route('/set-txp-multipiler')
    .post(controller.setTxpMultipiler);

router.route('/set-perf-part-rarity')
    .post(controller.setPerfPartRarityMultipiler);

export = router;
