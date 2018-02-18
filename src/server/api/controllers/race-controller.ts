import * as express from 'express';
import * as mongoose from 'mongoose';
import * as wait from 'wait.for';
import * as _ from 'lodash';
import * as PlayerModel from '../models/player-model';
import * as PerfPartModel from '../models/perf-part-model';
import { RaceResultsDTO } from '../dto-models/race-results-dto';
import { IPlayerModel } from 'src/server/api/models/player-model-interface';

export function onRaceEnd(request: express.Request, response: express.Response): void {
    distribute(request.body);
    response.sendStatus(200);
}


function distribute(raceResults: RaceResultsDTO): void {
    const txpMultipiler: number = Math.max(0, (raceResults.txpPointsMultipiler !== undefined ? raceResults.txpPointsMultipiler : 1));
    const perfPartFindMultipiler: number = Math.max(1, (raceResults.perfPartFindMultipiler !== undefined ? raceResults.perfPartFindMultipiler : 1));
    const noOfPlayers: number = raceResults.results.length;
    PlayerModel.schema
    for (const result of raceResults.results) {
        PlayerModel.findOne({ playerlogin: result.playerlogin }, function (error: any, document: IPlayerModel) {
            if (error)
                return;
            document.txp += calculateExtraTxp(txpMultipiler, noOfPlayers, result.position);
            document.inventory.push(generateRandomPerfPartDropId(perfPartFindMultipiler));
            document.save();
        });
    }
}

//TODO make querying for random part, including only tier
const VENDORS: Array<string>
    = ['Sebb. Co.', 'Poziofon Technologies', 'byZio Industries', 'Botaker Systems', 'KemotiumOre', 'Kamyl&Bugz'];
const PERFPARTTYPES: Array<string>
    = ['engine', 'transmission', 'tires'];

function generateRandomPerfPartDropId(multipiler: number): mongoose.Schema.Types.ObjectId {
    const tier: number = calculatePartDropTier(multipiler);
    const vendor: string = VENDORS[Math.floor(Math.random() * 6)];
    const perfparttype: string = PERFPARTTYPES[Math.floor(Math.random() * 3)];
    var perfPart = wait.for(PerfPartModel.findOne, { tier: tier, vendor: vendor, perfparttype: perfparttype });
    return perfPart._id;
}

/*
    TXP POINTS AFTER RACE FORMULA: m*(30+10p)/x+2
    x - position on finish line
    p - no. of players on server
    m - custom multipilter set by admin in request (must be real > 0,  default = 1)
*/
function calculateExtraTxp(multipiler: number, noOfPlayers: number, position: number): number {
    return multipiler * (30 + 10 * noOfPlayers) / (position + 2);
}

/*
    DROPPED TIER OF PERF PART FORMULA: min(3, floor(1 + x * m))
    x - rng(0,1)
    m - custom rarity multipiler set by admin in request (must be real > 1: m=1 grants only T1,
        m=2 grants T1 and T2 at 50% chance, m=3 grants T3 at 33%, m>4 grant T3 at >50% chance)
*/
function calculatePartDropTier(multipiler: number): number {
    return Math.min(3, Math.floor(1 + Math.random() * multipiler));
}



