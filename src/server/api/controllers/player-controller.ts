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
import { IPerfPartModel } from '../models/perf-part-model-interface';

export function getOrCreatePlayer(request: express.Request, response: express.Response): void {
    PlayerModel.findOne({ playerlogin: request.params.playerLogin }, ['playerlogin', 'txp'], function(error: any, player: IPlayerModel) {
        if (player == null) {
            createPlayer(request.params.playerLogin, response);
        } else {
            response.json(player);
        }
    });
}

function createPlayer(playerLogin: string, response: express.Response): void {
    const newPlayer: IPlayerModel = new PlayerModel({ playerlogin: playerLogin });
    newPlayer.save(function (error: any, player: IPlayerModel) {
        if (error) {
            response.sendStatus(500);
        }
        response.json({ txp: newPlayer.txp, _id: newPlayer._id, playerlogin: newPlayer.playerlogin });
    });
}

export function getAllPlayers(request: express.Request, response: express.Response): void {
    PlayerModel.find({}, ['playerlogin', 'txp'], function (error: any, players: IPlayerModel[]) {
        if (error) {
            response.send(error);
        }
        response.json(players);
    });
}

export function getFull(request: express.Request, response: express.Response): void {
    PlayerModel.findOne({ playerlogin: request.params.playerLogin })
        .populate('slotengine')
        .populate('slottransmission')
        .populate('slottires')
        .populate({path: 'inventory', model: 'PerfParts'})
        .exec(function (error: any, players: IPlayerModel[]) {
        if (error) {
            response.send(error);
        }
        response.json(players);
    });
}

export function deletePlayer(request: express.Request, response: express.Response): void {
    PlayerModel.remove({ playerlogin: request.params.playerLogin }, function(error: any) {
        if (error) {
            response.send(error);
        }
        response.sendStatus(200);
    });
}

export function getAllStats(request: express.Request, response: express.Response): void {
    
    Q(PlayerModel.find())
        .then(function(players: IPlayer[]) {
            const getStatsPromises: Array<Q.Promise<StatModelDTO>> = new Array<Q.Promise<StatModelDTO>>();
            for (const player of players) {
                getStatsPromises.push(getPlayerStats(player.playerlogin));
            }
            return Q.all(getStatsPromises);
        })
        .then(function(statModels: StatModelDTO[]) {
            response.send(statModels);
        })
        .catch(function (error: any) {
            response.send(error);
        })
        .done();
}

export function getStats(request: express.Request, response: express.Response): void {
    Q(getPlayerStats(request.params.playerLogin))
        .then(function(statModel: StatModelDTO) {
            response.send(statModel);
        })
        .catch(function(error: any) {
            response.send(error);
        })
        .done();
}

function getPlayerStats(playerLogin): Q.Promise<StatModelDTO> {
    let player: IPlayer;
    let slotEngine: IPerfPart;
    let slotTransmission: IPerfPart;
    let slotTires: IPerfPart;
    return Q(PlayerModel.findOne({ playerlogin: playerLogin })
        .populate('slotengine')
        .populate('slottransmission')
        .populate('slottires')
        .exec())
        .then(function (foundPlayer: IPlayer) {
            player = foundPlayer;
            return PerfPartModel.findById(player.slotengine).exec();
        })
        .then(function (foundPerfPart: IPerfPart) {
            slotEngine = foundPerfPart;
            return PerfPartModel.findById(player.slottransmission).exec();
        })
        .then(function (foundPerfPart: IPerfPart) {
            slotTransmission = foundPerfPart;
            return PerfPartModel.findById(player.slottires).exec();
        })
        .then(function (foundPerfPart: IPerfPart) {
            slotTires = foundPerfPart;
            const slots = _.chain([slotEngine, slotTransmission, slotTires]).filter((s) => s != null).value();
            const statModel: StatModelDTO = getCombinedStats(player.playerlogin, slots);
            return statModel;
        });
}

function getCombinedStats(playerLogin: string, slots: IPerfPart[]): StatModelDTO {
    const statModel: StatModelDTO = new StatModelDTO();
    statModel.playerLogin = playerLogin;
    statModel.accel = getStatMultipiler(slots, (s) => s.accel);
    statModel.breaking = getStatMultipiler(slots, (s) => s.breaking);
    statModel.driftairdecel = getStatMultipiler(slots, (s) => s.driftairdecel);
    statModel.grav = getStatMultipiler(slots, (s) => s.grav);
    statModel.maxspeed = getStatMultipiler(slots, (s) => s.maxspeed);
    statModel.steering = getStatMultipiler(slots, (s) => s.steering);
    statModel.turboaccel = getStatMultipiler(slots, (s) => s.turboaccel);
    statModel.turbodur = getStatMultipiler(slots, (s) => s.turbodur);
    statModel.waterbounce = getStatMultipiler(slots, (s) => s.waterbounce);
    return statModel;
}

function getStatMultipiler(slots: IPerfPart[], getSumElement: (s: IPerfPart) => number): number {
    return 1 + (_.chain(slots).map(getSumElement).sum().value() / 100);
}

export function equip(request: express.Request, response: express.Response): void {
    Q(PlayerModel.findOne({ playerlogin: request.params.playerLogin }))
        .then(function(player: IPlayerModel) {
            const equipData: EquipDataDTO = request.body;
            return applyEquipToDocument(player, equipData);
        })
        .then(function(player: IPlayerModel) {
            player.save();
            response.sendStatus(200);
        })
        .catch(function(error: any) {
            response.send(error);
        })
        .done();
}

function applyEquipToDocument(player: IPlayerModel, equipData: EquipDataDTO): Q.Promise<IPlayerModel> {
    return Q(PerfPartModel.findById(player.inventory[equipData.perfPartIndex]))
        .then(function (perfPart: IPerfPartModel) {
            if (perfPart == null) {
                throw new Error('Perf part not found. Most likely index exceeds player\'s inventory size.');
            }
            _.pullAt(player.inventory, [equipData.perfPartIndex]); // _pullAt mutates the source array
            player.markModified('inventory');
            switch (perfPart.perfparttype) {
                case 'engine':
                    player.slotengine = perfPart.id;
                    break;
                case 'transmission':
                    player.slottransmission = perfPart.id;
                    break;
                case 'tires':
                    player.slottires = perfPart.id;
                    break;
                default:
                    throw new Error('Equiped perfPart must be either engine/transmission/tires');
            }
            return player;
        });
}
