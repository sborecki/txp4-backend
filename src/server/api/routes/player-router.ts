import * as express from 'express';
import * as controller from '../controllers/player-controller';
import * as cors from 'cors';
import * as auth from '../../auth/auth-module';

const router: express.Router = express.Router();

router.route('/get')
    .get(auth.serverAuth, controller.getAllPlayers);

router.route('/get/:playerLogin')
    .get(auth.serverAuth, controller.get)
    .delete(auth.serverAuth, controller.deletePlayer);

router.route('/get-full/:playerLogin')
    .get(cors(), auth.playerAuth, controller.getFull);

router.route('/stats')
    .get(auth.serverAuth, controller.getAllStats);

router.route('/stats/:playerLogin')
    .get(auth.serverAuth, controller.getStats);

router.route('/equip/:playerLogin')
    .post(cors(), auth.playerAuth, controller.equip)
    .options(cors());

export = router;
