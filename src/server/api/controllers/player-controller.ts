import * as express from 'express';
import * as mongoose from 'mongoose';
import * as co from 'co';
import * as PlayerModel from '../models/player-model';
import * as PerfPartModel from '../models/perf-part-model';

export function getOrCreatePlayer(request: express.Request, response: express.Response): void {
    PlayerModel.findOne({ name: request.params.playerLogin }, function (error: any, document: mongoose.Document) {
        if (document == null) { //TODO: check what happens if player is not found
            createPlayer(request, response);
        } else {
            response.json(document);
        }
    });
}

function createPlayer(request: express.Request, response: express.Response): void {
    const newPlayer: mongoose.Document = new PlayerModel({ name: request.params.playerLogin });
    newPlayer.save(function (error, document) {
        if (error)
            response.send(error);
        response.json(document);
    });
}

export function deletePlayer(request: express.Request, response: express.Response): void {
    PlayerModel.remove({ name: request.params.playerLogin }, function (error) {
        if (error)
            response.send(error);
        response.sendStatus(200);
    });
}

export function getStats(request: express.Request, response: express.Response): void {
    PlayerModel.findOne({ name: request.params.playerLogin }, co(function* (error: any, document: mongoose.Document) {
        if (error)
            response.send(error);
        const slot1: Promise<mongoose.Document> = Promise.resolve(PerfPartModel.findById(document.get('slot1')));
        const slot2: Promise<mongoose.Document> = Promise.resolve(PerfPartModel.findById(document.get('slot2')));
        const slot3: Promise<mongoose.Document> = Promise.resolve(PerfPartModel.findById(document.get('slot3')));
        const slotValues: Array<mongoose.Document> = yield [slot1, slot2, slot3];
        response.send(addUpPerfPartValues(slotValues));
    }).catch(response.sendStatus(500)));
}

function addUpPerfPartValues(slots: Array<mongoose.Document>) {
    //slots.forEach(...);
}

export function equip(request: express.Request, response: express.Response): void {

}

export function reset(request: express.Request, response: express.Response): void {

}

