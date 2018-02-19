import * as express from 'express';
import * as mongoose from 'mongoose';
import * as co from 'co';
import * as _ from 'lodash';
import * as Q from 'q';
import * as PlayerModel from '../models/player-model';
import * as PerfPartModel from '../models/perf-part-model';
import { StatModelDTO } from '../dto-models/stat-model-dto';
import { EquipDataDTO } from '../dto-models/equip-data-dto';
import { IPlayerModel } from '../models/player-model-interface';
import { IPerfPart } from '../models/perf-part-interface';

export function getOrCreatePlayer(request: express.Request, response: express.Response): void {
    PlayerModel.findOne({ playerlogin: request.params.playerLogin }, function (error: any, player: IPlayerModel) {
        if (player == null) {
            createPlayer(request.params.playerLogin, response);
        } else {
            response.json(player);
        }
    });
}

function createPlayer(playerLogin: string, response: express.Response): void {
    const newPlayer: mongoose.Document = new PlayerModel({ playerlogin: playerLogin });
    newPlayer.save(function (error: any, player: IPlayerModel) {
        if (error)
            response.sendStatus(500);
        response.json(player);
    });
}

export function deletePlayer(request: express.Request, response: express.Response): void {
    PlayerModel.remove({ playerlogin: request.params.playerLogin }, function (error: any) {
        if (error)
            response.send(error);
        response.sendStatus(200);
    });
}

export function getStats(request: express.Request, response: express.Response): void {
    //TODO: Q.fcall().then...;

    PlayerModel.findOne({ playerlogin: request.params.playerLogin }, co(function* (error: any, player: IPlayerModel) {
        if (error)
            response.send(error);
        const slot1: Promise<IPerfPart> = Promise.resolve(PerfPartModel.findById(player.slot1));
        const slot2: Promise<IPerfPart> = Promise.resolve(PerfPartModel.findById(player.slot2));
        const slot3: Promise<IPerfPart> = Promise.resolve(PerfPartModel.findById(player.slot3));
        const slotValues: Array<IPerfPart> = yield [slot1, slot2, slot3];
        const statDocument :String = getCombinedStatsAsJSON(slotValues); //TODO: not working, do we need callback here?
        response.send(statDocument);
    }).catch(response.sendStatus(500)));
}

function getCombinedStatsAsJSON(slots: IPerfPart[]): string {
    var statModel: StatModelDTO;
    statModel.accel = _.chain(slots).map((s) => s.accel).sum().value();
    statModel.breaking = _.chain(slots).map((s) => s.breaking).sum().value();
    statModel.driftairdecel = _.chain(slots).map((s) => s.driftairdecel).sum().value();
    statModel.grav = _.chain(slots).map((s) => s.grav).sum().value();
    statModel.maxspeed = _.chain(slots).map((s) => s.maxspeed).sum().value();
    statModel.steering = _.chain(slots).map((s) => s.steering).sum().value();
    statModel.turboaccel = _.chain(slots).map((s) => s.turboaccel).sum().value();
    statModel.turbodur = _.chain(slots).map((s) => s.turbodur).sum().value();
    statModel.waterbounce = _.chain(slots).map((s) => s.waterbounce).sum().value();
    return JSON.stringify(statModel);
}

export function equip(request: express.Request, response: express.Response): void {
    PlayerModel.findOne({ playerlogin: request.params.playerLogin }, function (error: any, player: IPlayerModel) {
        if (error)
            response.send(error);
        const equipData: EquipDataDTO = JSON.parse(request.body);
        try {
            player = applyEquipToDocument(player, equipData);
        } catch (ex) {
            response.sendStatus(400);
        }
        player.save();
        response.sendStatus(200);
    });
}

function applyEquipToDocument(player: IPlayerModel, equipData: EquipDataDTO) {
    const currentInventory: mongoose.Schema.Types.ObjectId[] = player.inventory;
    const targetPerfPartId: mongoose.Schema.Types.ObjectId = currentInventory[equipData.sourcePerfPartIndex];
    if (targetPerfPartId == null)
        throw new Error('Part index exceeds player\'s inventory.');
    switch (equipData.targetSlotId) {
        case 1:
            player.slot1 = targetPerfPartId;
            break;
        case 2:
            player.slot2 = targetPerfPartId;
            break;
        case 3:
            player.slot3 = targetPerfPartId;
            break;
        default:
            throw new Error('Slot must be an integer between 1 and 3');
    }
    const modifiedInventory: mongoose.Schema.Types.ObjectId[] = _.pull(currentInventory, targetPerfPartId);
    player.inventory = modifiedInventory;
    return player;
}

export function resetAll(request: express.Request, response: express.Response): void {
    PlayerModel.update({}, { txp: 0, slot1: null, slot2: null, slot3: null, inventory: [] }, function (error) {
            if (error)
                response.send(error);
            response.sendStatus(200);
        }
    );
}

