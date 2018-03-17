import * as express from 'express';
import * as controller from '../controllers/perf-part-controller';
import { serverAuth } from '../../auth/server-auth';
import * as cors from 'cors';

const router: express.Router = express.Router();

router.route('/:perfPartId')
    .get(cors(), serverAuth.auth, controller.getPerfPartById);

router.route('/')
    .get(cors(), serverAuth.auth, controller.getAllPerfParts);


export = router;
