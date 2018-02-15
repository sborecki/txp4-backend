import * as express from 'express';
import * as perfPartRouter from './perf-part-router';
import * as playerRouter from './player-router';

const router: express.Router = express.Router();
router.use('/perf-part', perfPartRouter);
router.use('/player', playerRouter);
export = router;