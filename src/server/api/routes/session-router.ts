import * as express from 'express';
import * as controller from '../controllers/session-controller';

const router: express.Router = express.Router();

router.route('/')
    .get(controller.get)
    .delete(controller.reset);

router.route('/setTxpMultipiler/:multipiler')
    .get(controller.setTxpMultipiler);

router.route('/setPerfPartRarity/:multipiler')
    .get(controller.setPerfPartRarityMultipiler);

export = router;
