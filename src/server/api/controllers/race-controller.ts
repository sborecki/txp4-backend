import * as express from 'express';
import * as mongoose from 'mongoose';
import * as Q from 'q';
import * as _ from 'lodash';
import * as PlayerModel from '../models/player-model';
import { IPlayerModel } from '../models/player-model-interface';
import * as PerfPartModel from '../models/perf-part-model';
import { IPerfPartModel } from '../models/perf-part-model-interface';
import * as SessionModel from '../models/session-model';
import { ISessionModel } from '../models/session-model-interface';
import { RaceResultsDTO } from '../dto-models/race-results-dto';
import { RacePositionDTO } from '../dto-models/race-position-dto';
import { RaceParamsDTO } from '../dto-models/race-params-dto';
import { DistributionResultDTO } from '../dto-models/distribution-result-dto';

export function onRaceEnd(request: express.Request, response: express.Response): void {
    Q(SessionModel.findOne())
        .then(function (session: ISessionModel) {
            session.raceCount += 1;
            session.save();
            const updatePromises: Array<Q.Promise<DistributionResultDTO>> = getDistributePointsPromise(request.body, session);
            return Q.all(updatePromises);
        })
        .then(function(results: DistributionResultDTO[]) {
            const output: string = getGenerateOutputString(results);
            response.send({ msg: output });
        })
        .catch(function(error: any) {
            response.send(error);
        })
        .done();
}

function getDistributePointsPromise(raceResults: RaceResultsDTO, session: ISessionModel): Array<Q.Promise<DistributionResultDTO>> {
    const raceParams: RaceParamsDTO = new RaceParamsDTO();
    raceParams.txpMultipiler = session.txpMultipiler;
    raceParams.raceCountForPerfPartRarity = session.raceCount * session.perfPartRarityMultipiler;
    raceParams.noOfPlayers = raceResults.results.length;

    const updatePromises: Array<Q.Promise<DistributionResultDTO>> = new Array<Q.Promise<DistributionResultDTO>>();
    for (const raceResult of raceResults.results) {
        updatePromises.push(getUpdatePlayerPromise(raceResult, raceParams));
    }
    return updatePromises;
}

function getUpdatePlayerPromise(racePosition: RacePositionDTO, raceParams: RaceParamsDTO): Q.Promise<DistributionResultDTO> {
    let player: IPlayerModel;
    let tier: number;
    return Q(PlayerModel.findOne({ playerlogin: racePosition.playerLogin }).exec())
        .then(function(foundPlayer: IPlayerModel) {
            player = foundPlayer;
            tier = calculatePartDropTier(raceParams.raceCountForPerfPartRarity);
            return PerfPartModel.count({ tier: tier }).exec();
        })
        .then(function(perfPartsNo: number) {
            const random = Math.floor(Math.random() * perfPartsNo);
            return PerfPartModel.findOne({ tier: tier }).skip(random).exec();
        })
        .then(function(randomPerfPart: IPerfPartModel) {
            const result: DistributionResultDTO = new DistributionResultDTO();
            result.playerLogin = player.playerlogin;
            result.grantedTxp = calculateExtraTxp(raceParams.txpMultipiler, raceParams.noOfPlayers, racePosition.position);
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
    DROPPED TIER OF PERF PART FORMULA: clamp(floor(x + (p/5)), 1, 3)
    x - rng(0,1)
    p - number of track * custom rarity multipiler set by admin; by default multipiler is just 1
        then: after track 1-5 only T1, 6-10 T1/T2, 11-15 T2/T3, 16+ only T3
*/
function calculatePartDropTier(multipiler: number): number {
    const tier: number = Math.floor(Math.random() + (multipiler / 5));
    return Math.max(1, Math.min(tier, 3));
}
