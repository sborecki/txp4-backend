import * as express from 'express';
import * as mongoose from 'mongoose';
import * as Q from 'q';
import * as _ from 'lodash';
import * as PlayerModel from '../models/player-model';
import * as PerfPartModel from '../models/perf-part-model';
import { RaceResultsDTO } from '../dto-models/race-results-dto';
import { RacePositionDTO } from '../dto-models/race-position-dto';
import { RaceParamsDTO } from '../dto-models/race-params-dto';
import { DistributionResultDTO } from '../dto-models/distribution-result-dto';
import { IPlayerModel } from '../models/player-model-interface';
import { IPerfPartModel } from 'src/server/api/models/perf-part-model-interface';

export function onRaceEnd(request: express.Request, response: express.Response): void {
    const updatePromises: Array<Q.Promise<DistributionResultDTO>> = getDistributePointsPromise(request.body);
    Q.all(updatePromises)
        .then(function(results: DistributionResultDTO[]) {
            const output: string = getGenerateOutputString(results);
            response.send({ msg: output });
        })
        .catch(function(error: any) {
            response.send(error);
        })
        .done();
}

function getDistributePointsPromise(raceResults: RaceResultsDTO): Array<Q.Promise<DistributionResultDTO>> {
    const raceParams: RaceParamsDTO = new RaceParamsDTO();
    raceParams.txpMultipiler =
        Math.max(0, (raceResults.txpPointsMultipiler !== undefined ? raceResults.txpPointsMultipiler : 1));
    raceParams.perfPartFindMultipiler =
        Math.max(1, (raceResults.perfPartFindMultipiler !== undefined ? raceResults.perfPartFindMultipiler : 1));
    raceParams.noOfPlayers = raceResults.results.length;

    const updatePromises: Array<Q.Promise<DistributionResultDTO>> = new Array<Q.Promise<DistributionResultDTO>>();
    for (const raceResult of raceResults.results) {
        updatePromises.push(getUpdatePlayerPromise(raceResult, raceParams));
    }
    return updatePromises;
}

function getUpdatePlayerPromise(racePosition: RacePositionDTO, raceParams: RaceParamsDTO)
        : Q.Promise<DistributionResultDTO> {
    let player: IPlayerModel;
    let tier: number;
    return Q(PlayerModel.findOne({ playerlogin: racePosition.playerLogin }).exec())
        .then(function(foundPlayer: IPlayerModel) {
            player = foundPlayer;
            tier = calculatePartDropTier(raceParams.perfPartFindMultipiler);
            return PerfPartModel.count({ tier: tier }).exec();
        })
        .then(function(perfPartsNo: number) {
            const random = Math.floor(Math.random() * perfPartsNo);
            return PerfPartModel.findOne({ tier: tier }).skip(random).exec();
        })
        .then(function(randomPerfPart: IPerfPartModel) {
            const result: DistributionResultDTO = new DistributionResultDTO();
            result.playerLogin = player.playerlogin;
            result.grantedTxp =
                calculateExtraTxp(raceParams.txpMultipiler, raceParams.noOfPlayers, racePosition.position);
            result.grantedPerfPartTier = randomPerfPart.tier;
            result.grantedPerfPartType = randomPerfPart.perfparttype;
            result.grantedPerfPartVendor = randomPerfPart.vendor;

            player.txp += result.grantedTxp;
            player.inventory.push(randomPerfPart._id);
            player.save();
            return result;
        });
}

function getGenerateOutputString(results: Array<DistributionResultDTO>): string {
    return _.orderBy(results, [(r) => r.grantedTxp], [`desc`])
        .map((r) => `${r.playerLogin}»${r.grantedTxp}txp+(T${r.grantedPerfPartTier})`)
        .join(` `);
}

/*
    TXP POINTS AFTER RACE FORMULA: m*(30+10p)/x+2
    x - position on finish line
    p - no. of players on server
    m - custom multipilter set by admin in request (must be real > 0,  default = 1)
*/
function calculateExtraTxp(multipiler: number, noOfPlayers: number, position: number): number {
    return Math.round(multipiler * (30 + 10 * noOfPlayers) / (position + 2));
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
