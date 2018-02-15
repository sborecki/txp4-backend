import * as express from 'express';
import * as controller from '../controllers/player-controller';

const router: express.Router = express.Router();

router.route('/:playerId')
    .get(controller.getOrCreatePlayer)
    .delete(controller.deletePlayer);

router.route('/:playerId/stats')
    .get(controller.getStats);

router.route('/:playerId/equip')
    .post(controller.equip);

router.route('/:playerId/reset')
    .post(controller.reset);

export = router;