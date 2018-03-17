import * as express from 'express';
import * as controller from '../controllers/perf-part-controller';
import * as auth from '../../auth/auth-module';

const router: express.Router = express.Router();

router.route('/:perfPartId')
    .get(auth.adminAuth, controller.getPerfPartById);

router.route('/')
    .get(auth.adminAuth, controller.getAllPerfParts);

export = router;
