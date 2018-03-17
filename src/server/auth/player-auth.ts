import { AbstractAuth } from './abstract-auth';
import { AdminAuth } from './admin-auth';
import * as mongoose from 'mongoose';
import * as PlayerModel from '../api/models/player-model';
import { IPlayerModel } from '../api/models/player-model-interface';

export class PlayerAuth extends AbstractAuth {

    constructor() {
        super(new AdminAuth());
        //this.checkAuth = this.checkAuth.bind(this);
    };

    protected checkAuth(login: String, pass: String): Promise<boolean> {
        return PlayerModel.findOne({ playerlogin: login }, ['pass'])
            .then(function (player: IPlayerModel) {
                return (player != null && player.pass != null && player.pass === pass);
            })
            .catch(function (error: any) {
                return false;
            });
    }

}

export let playerAuth = new PlayerAuth();