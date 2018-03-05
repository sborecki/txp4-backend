import * as express from 'express';
import * as controller from '../controllers/player-controller';
import * as cors from 'cors';

const router: express.Router = express.Router();

router.route('/get')
    .get(controller.getAllPlayers);

router.route('/get/:playerLogin')
    .get(controller.get)
    .delete(controller.deletePlayer);

router.route('/get-full/:playerLogin')
    .get(cors(), controller.getFull);

router.route('/stats')
    .get(controller.getAllStats);

router.route('/stats/:playerLogin')
    .get(controller.getStats);

router.route('/equip/:playerLogin')
    .post(cors(), controller.equip)
    .options(cors());

export = router;
