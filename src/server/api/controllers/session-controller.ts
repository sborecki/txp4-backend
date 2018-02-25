import * as express from 'express';
import * as mongoose from 'mongoose';
import * as Q from 'q';
import * as _ from 'lodash';
import * as SessionModel from '../models/session-model';
import { ISessionModel } from '../models/session-model-interface';
import * as PlayerModel from '../models/player-model';
import { IPlayerModel } from '../models/player-model-interface';

export function get(request: express.Request, response: express.Response): void {
    SessionModel.findOne(function (error: any, session: ISessionModel) {
        if (error) {
            response.send(error);
        }
        response.json(session);
    });
}

export function setTxpMultipiler(request: express.Request, response: express.Response): void {
    const multipiler = Math.max(0, request.params.multipiler);
    SessionModel.updateOne({ txpMultipiler: multipiler }, function (error: any, session: ISessionModel) {
        if (error) {
            response.send(error);
        }
        response.sendStatus(200);
    });
}

export function setPerfPartRarityMultipiler(request: express.Request, response: express.Response): void {
    const multipiler = Math.max(1, request.params.multipiler);
    SessionModel.updateOne({ perfPartRarityMultipiler: multipiler }, function (error: any, session: ISessionModel) {
        if (error) {
            response.send(error);
        }
        response.sendStatus(200);
    });
}

export function reset(request: express.Request, response: express.Response): void {
    Q.all([
        PlayerModel.update({}, { txp: 0, slot1: null, slot2: null, slot3: null, inventory: [] }, { multi: true }),
        SessionModel.updateOne({}, { txpMultipiler: 1, perfPartMultipier: 1, raceCount: 0 })
        ])
        .then(function() {
            response.sendStatus(200);
        })
        .catch(function(error: any) {
            response.send(error);
        })
        .done();
}