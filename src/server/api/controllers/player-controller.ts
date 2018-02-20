import * as express from 'express';
import * as mongoose from 'mongoose';
import * as Q from 'q';
import * as _ from 'lodash';
import * as PlayerModel from '../models/player-model';
import * as PerfPartModel from '../models/perf-part-model';
import { StatModelDTO } from '../dto-models/stat-model-dto';
import { EquipDataDTO } from '../dto-models/equip-data-dto';
import { IPlayerModel } from '../models/player-model-interface';
import { IPerfPart } from '../models/perf-part-interface';
import { IPlayer } from '../models/player-interface';

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
    var player: IPlayer;
    var slot1, slot2, slot3: IPerfPart;
    Q(PlayerModel.findOne({ playerlogin: request.params.playerLogin }).exec())
        .then(function (_player: IPlayer) {
            player = _player;
            return PerfPartModel.findById(player.slot1).exec();
        })
        .then(function (_perfPart: IPerfPart) {
            slot1 = _perfPart;
            return PerfPartModel.findById(player.slot2).exec();
        })
        .then(function (_perfPart: IPerfPart) {
            slot2 = _perfPart;
            return PerfPartModel.findById(player.slot3).exec();
        })
        .then(function (_perfPart: IPerfPart) {
            slot3 = _perfPart;
            const slots = _.chain([slot1, slot2, slot3]).filter(s => s != null).value();
            const statModel: StatModelDTO = getCombinedStats(slots);
            response.send(statModel);
        })
        .catch(function (error: any) {
            response.send(error);
        })
        .done();
}

function getCombinedStats(slots: IPerfPart[]): StatModelDTO {
    var statModel: StatModelDTO = new StatModelDTO();
    statModel.accel = _.chain(slots).map((s) => s.accel).sum().value();
    statModel.breaking = _.chain(slots).map((s) => s.breaking).sum().value();
    statModel.driftairdecel = _.chain(slots).map((s) => s.driftairdecel).sum().value();
    statModel.grav = _.chain(slots).map((s) => s.grav).sum().value();
    statModel.maxspeed = _.chain(slots).map((s) => s.maxspeed).sum().value();
    statModel.steering = _.chain(slots).map((s) => s.steering).sum().value();
    statModel.turboaccel = _.chain(slots).map((s) => s.turboaccel).sum().value();
    statModel.turbodur = _.chain(slots).map((s) => s.turbodur).sum().value();
    statModel.waterbounce = _.chain(slots).map((s) => s.waterbounce).sum().value();
    return statModel;
}

export function equip(request: express.Request, response: express.Response): void {
    Q(PlayerModel.findOne({ playerlogin: request.params.playerLogin }))
        .then(function (player: IPlayerModel) {
            const equipData: EquipDataDTO = request.body;
            return applyEquipToDocument(player, equipData);
        })
        .then(function (player: IPlayerModel) {
            player.save(); //for some reason array does not get shortened
            response.sendStatus(200); 
        })
        .catch(function (error: any) {
            response.send(error);
        })
        .done();
}

async function applyEquipToDocument(player: IPlayerModel, equipData: EquipDataDTO): Promise<IPlayerModel> {
    const pulledPerfPartId: mongoose.Schema.Types.ObjectId[] =
        _.pullAt(player.inventory, [equipData.sourcePerfPartIndex]); 
    player.markModified('inventory'); //_pullAt mutates the source array
    if (pulledPerfPartId[0] == null)
        throw new Error('Part index exceeds player\'s inventory.');
    switch (equipData.targetSlotId) {
        case 1:
            player.slot1 = pulledPerfPartId[0];
            break;
        case 2:
            player.slot2 = pulledPerfPartId[0];
            break;
        case 3:
            player.slot3 = pulledPerfPartId[0];
            break;
        default:
            throw new Error('Slot must be an integer between 1 and 3');
    }
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

