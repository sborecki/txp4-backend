import * as express from 'express';
import * as controller from '../controllers/player-controller';

const router: express.Router = express.Router();

router.route('/')
    .delete(controller.resetAll);

router.route('/:playerLogin')
    .get(controller.getOrCreatePlayer)
    .delete(controller.deletePlayer);

router.route('/:playerLogin/stats')
    .get(controller.getStats);

router.route('/:playerLogin/equip')
    .post(controller.equip);

export = router;