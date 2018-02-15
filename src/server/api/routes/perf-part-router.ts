import * as express from 'express';
import * as controller from '../controllers/perf-part-controller';

const router: express.Router = express.Router();

router.route('/:perfPartId')
    .get(controller.getPerfPartById);

router.route('/')
    .get(controller.getAllPerfParts);

export = router;
