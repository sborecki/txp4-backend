import * as express from 'express';
import * as mongoose from 'mongoose';
import * as co from 'co';
import * as _ from 'lodash';
import * as PlayerModel from '../models/player-model';
import * as PerfPartModel from '../models/perf-part-model';
import { StatModelDTO } from '../dto-models/stat-model-dto';
import { EquipDataDTO } from '../dto-models/equip-data-dto';
import { IPlayerModel } from 'src/server/api/models/player-model-interface';

export function getOrCreatePlayer(request: express.Request, response: express.Response): void {
    PlayerModel.findOne({ playerlogin: request.params.playerLogin }, function (error: any, document: IPlayerModel) {
        if (document == null) {
            createPlayer(request.params.playerLogin, response);
        } else {
            response.json(document);
        }
    });
}

function createPlayer(playerLogin: string, response: express.Response): void {
    const newPlayer: mongoose.Document = new PlayerModel({ playerlogin: playerLogin });
    newPlayer.save(function (error: any, document: IPlayerModel) {
        if (error)
            response.sendStatus(500);
        response.json(document);
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
    PlayerModel.findOne({ playerlogin: request.params.playerLogin }, co(function* (error: any, document: IPlayerModel) {
        if (error)
            response.send(error);
        const slot1: Promise<mongoose.Document> = Promise.resolve(PerfPartModel.findById(document.slot1));
        const slot2: Promise<mongoose.Document> = Promise.resolve(PerfPartModel.findById(document.slot2));
        const slot3: Promise<mongoose.Document> = Promise.resolve(PerfPartModel.findById(document.slot3));
        const slotValues: Array<mongoose.Document> = yield [slot1, slot2, slot3];
        const statDocument :String = getCombinedStatsAsJSON(slotValues); //TODO: not working, do we need callback here?
        response.send(statDocument);
    }).catch(response.sendStatus(500)));
}

function getCombinedStatsAsJSON(slots: Array<mongoose.Document>): string {
    var statModel: StatModelDTO;
    statModel.accel = _.chain(slots).map((s) => s.accel).sum();
    statModel.breaking = _.chain(slots).map((s) => s.breaking).sum();
    statModel.driftairdecel = _.chain(slots).map((s) => s.driftairdecel).sum();
    statModel.grav = _.chain(slots).map((s) => s.grav).sum();
    statModel.maxspeed = _.chain(slots).map((s) => s.maxspeed).sum();
    statModel.steering = _.chain(slots).map((s) => s.steering).sum();
    statModel.turboaccel = _.chain(slots).map((s) => s.turboaccel).sum();
    statModel.turbodur = _.chain(slots).map((s) => s.turbodur).sum();
    statModel.waterbounce = _.chain(slots).map((s) => s.waterbounce).sum();
    return JSON.stringify(statModel);
}

export function equip(request: express.Request, response: express.Response): void {
    PlayerModel.findOne({ playerlogin: request.params.playerLogin }, function (error: any, document: IPlayerModel) {
        if (error)
            response.send(error);
        const equipData: EquipDataDTO = JSON.parse(request.body);
        try {
            document = applyEquipToDocument(document, equipData);
        } catch (ex) {
            response.sendStatus(400);
        }
        document.save();
        response.sendStatus(200);
    });
}

function applyEquipToDocument(document: IPlayerModel, equipData: EquipDataDTO) {
    const currentInventory: Array<mongoose.Schema.Types.ObjectId> = document.inventory;
    const targetPerfPartId: mongoose.Schema.Types.ObjectId = currentInventory[equipData.sourcePerfPartIndex];
    if (targetPerfPartId == null)
        throw new Error('Part index exceeds player\'s inventory.');
    switch (equipData.targetSlotId) {
        case 1:
            document.slot1 = targetPerfPartId;
            break;
        case 2:
            document.slot2 = targetPerfPartId;
            break;
        case 3:
            document.slot3 = targetPerfPartId;
            break;
        default:
            throw new Error('Slot must be an integer between 1 and 3');
    }
    const modifiedInventory: Array<mongoose.Schema.Types.ObjectId> = _.pull(currentInventory, targetPerfPartId);
    document.inventory = modifiedInventory;
    return document;
}

export function resetAll(request: express.Request, response: express.Response): void {
    PlayerModel.update({}, { txp: 0, slot1: null, slot2: null, slot3: null, inventory: [] }, function (error) {
            if (error)
                response.send(error);
            response.sendStatus(200);
        }
    );
}

