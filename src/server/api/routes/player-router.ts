import * as express from 'express';
import * as controller from '../controllers/player-controller';

const router: express.Router = express.Router();

//TODO: move to session
//router.route('/')
//    .delete(controller.resetAll);

router.route('/get')
    .get(controller.getAllPlayers);

router.route('/get/:playerLogin')
    .get(controller.getOrCreatePlayer)
    .delete(controller.deletePlayer);

router.route('/stats')
    .get(controller.getAllStats);

router.route('/stats/:playerLogin')
    .get(controller.getStats);

router.route('/equip/:playerLogin')
    .post(controller.equip);

export = router;
