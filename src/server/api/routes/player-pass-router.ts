import * as express from 'express';
import * as controller from '../controllers/player-pass-controller';

const router: express.Router = express.Router();

router.route('/:playerLogin')
    .get(controller.getOrGenerate)
    .post(controller.validate)
    .delete(controller.remove)

export = router;
