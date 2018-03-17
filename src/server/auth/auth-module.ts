import * as express from 'express';
import * as mongoose from 'mongoose';
import * as PlayerModel from '../api/models/player-model';
import { IPlayerModel } from '../api/models/player-model-interface';

export function adminAuth(request: express.Request, response: express.Response, next: (request: express.Request, response: express.Response) => void): void {
    return auth(request, response, next, checkAdminAuth);
}

export function serverAuth(request: express.Request, response: express.Response, next: (request: express.Request, response: express.Response) => void): void {
    return auth(request, response, next, checkServerAuth);
}

export function playerAuth(request: express.Request, response: express.Response, next: (request: express.Request, response: express.Response) => void): void {
    return auth(request, response, next, checkPlayerAuth);
}

function auth(request: express.Request, response: express.Response, next: (request: express.Request, response: express.Response) => void,
    checkAuth: (login: String, pass: String) => Promise<boolean>) : void {
    checkAuth(getLogin(request), getPass(request))
        .then(isAuthorized => isAuthorized ? next(request, response) : response.sendStatus(401));
}

function getLogin(request: express.Request): String {
    if (request.params.playerLogin !== undefined && request.params.playerLogin instanceof String) {
        return request.params.playerLogin;
    }
    return '';
}

function getPass(request: express.Request): String {
    if (request.query.pass !== undefined) {
        return request.query.pass;
    }
    return '';
}

function checkAdminAuth(login: String, pass: String): Promise<boolean> {
    return Promise.resolve(pass === process.env.ADMIN_AUTH_SECRET);
}

function checkServerAuth(login: String, pass: String): Promise<boolean> {
    return Promise.resolve(pass === process.env.SERVER_AUTH_SECRET);
}

function checkPlayerAuth(login: String, pass: String): Promise<boolean> {
    return PlayerModel.findOne({ playerlogin: login }, ['pass'])
        .then(function (player: IPlayerModel) {
            return (player != null && player.pass != null && player.pass === pass);
        })
        .catch(function (error: any) {
            return false;
        });
}