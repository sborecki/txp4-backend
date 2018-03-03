import * as express from 'express';
import * as mongoose from 'mongoose';
import * as Q from 'q';
import * as _ from 'lodash';
import * as SessionModel from '../models/session-model';
import { ISessionModel } from '../models/session-model-interface';
import * as PlayerModel from '../models/player-model';
import { IPlayerModel } from '../models/player-model-interface';
import { MultipilerDTO } from '../dto-models/multipiler-dto';

export function get(request: express.Request, response: express.Response): void {
    SessionModel.findOne(function (error: any, session: ISessionModel) {
        if (error) {
            response.send(error);
        }
        response.json(session);
    });
}

export function setTxpMultipiler(request: express.Request, response: express.Response): void {
    const params: MultipilerDTO = request.body;
    const multipiler = Math.max(0, params.multipiler);
    SessionModel.updateOne({ txpMultipiler: multipiler }, function (error: any, session: ISessionModel) {
        if (error) {
            response.send(error);
        }
        response.sendStatus(200);
    });
}

export function setPerfPartRarityMultipiler(request: express.Request, response: express.Response): void {
    const params: MultipilerDTO = request.body;
    const multipiler = Math.max(0, params.multipiler);
    SessionModel.updateOne({ perfPartRarityMultipiler: multipiler }, function (error: any, session: ISessionModel) {
        if (error) {
            response.send(error);
        }
        response.sendStatus(200);
    });
}

export function reset(request: express.Request, response: express.Response): void {
    Q.all([
        PlayerModel.update({}, { txp: 0, slotengine: null, slottransmission: null, slottires: null, inventory: [] }, { multi: true }),
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