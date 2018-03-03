import * as express from 'express';
import * as perfPartRouter from './perf-part-router';
import * as playerPassRouter from './player-pass-router';
import * as playerRouter from './player-router';
import * as raceRouter from './race-router';
import * as sessionRouter from './session-router';

const router: express.Router = express.Router();

router.use('/perf-part', perfPartRouter);
router.use('/player-pass', playerPassRouter);
router.use('/player', playerRouter);
router.use('/race', raceRouter);
router.use('/session', sessionRouter);

export = router;
