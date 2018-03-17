import * as express from 'express';
import * as controller from '../controllers/perf-part-controller';
import * as auth from '../../auth/auth-module';
import * as cors from 'cors';

const router: express.Router = express.Router();

router.route('/:perfPartId')
    .get(cors(), auth.playerAuth, controller.getPerfPartById);

router.route('/')
    .get(cors(), auth.playerAuth, controller.getAllPerfParts);


export = router;
