import * as express from 'express';
import * as controller from '../controllers/player-controller';
import * as cors from 'cors';
import { playerAuth } from '../../auth/player-auth';
import { serverAuth } from '../../auth/server-auth';

const router: express.Router = express.Router();

router.route('/get')
    .get(serverAuth.auth, controller.getAllPlayers);

router.route('/get/:playerLogin')
    .get(serverAuth.auth, controller.get)
    .delete(serverAuth.auth, controller.deletePlayer);

router.route('/get-full/:playerLogin')
    .get(cors(), playerAuth.auth, controller.getFull);

router.route('/stats')
    .get(serverAuth.auth, controller.getAllStats);

router.route('/stats/:playerLogin')
    .get(serverAuth.auth, controller.getStats);

router.route('/equip/:playerLogin')
    .post(cors(), playerAuth.auth, controller.equip)
    .options(cors());

export = router;
