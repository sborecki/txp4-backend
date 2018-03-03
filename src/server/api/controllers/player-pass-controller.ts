import * as express from 'express';
import * as mongoose from 'mongoose';
import * as Q from 'q';
import * as _ from 'lodash';
import * as crypto from 'crypto';
import * as PlayerModel from '../models/player-model';
import { IPlayer } from '../models/player-interface';
import { IPlayerModel } from '../models/player-model-interface';
import { PlayerPassDTO } from '../dto-models/player-pass-dto';

export function getOrGenerate(request: express.Request, response: express.Response): void {
    Q(PlayerModel.findOne({ playerlogin: request.params.playerLogin }))
        .then(function (player: IPlayerModel) {
            if (player == null) {
                player = new PlayerModel({ playerlogin: request.params.playerLogin });
            }
            if (player.pass == null) {
                player.pass = generateNewPass();
                return player.save();
            } else {
                return player;
            }
        })
        .then(function (player: IPlayer) {
            const playerPassDTO: PlayerPassDTO = new PlayerPassDTO();
            playerPassDTO.pass = player.pass;
            response.send(playerPassDTO);
        })
        .catch(function(error: any) {
            response.send(error);
        })
        .done();
}

export function validate(request: express.Request, response: express.Response): void {
    const playerPassDTO: PlayerPassDTO = request.body;
    PlayerModel.findOne({ playerlogin: request.params.playerLogin }, ['pass'], function (error: any, player: IPlayerModel) {
        if (error) {
            response.sendStatus(401);
        } else if (player != null && player.pass != null && player.pass === playerPassDTO.pass) {
            response.sendStatus(202);
        } else {
            response.sendStatus(401);
        }
    });
}

export function remove(request: express.Request, response: express.Response): void {
    PlayerModel.updateOne({ playerlogin: request.params.playerLogin }, { pass: null },  function (error: any, session: IPlayerModel) {
        if (error) {
            response.send(error);
        }
        response.sendStatus(200);
    });
}

function generateNewPass(): string {
    return crypto.randomBytes(20).toString('hex');
}
