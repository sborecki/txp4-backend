import * as express from 'express';
import { ServerAuth } from './server-auth';
import { PlayerAuth } from './player-auth';

export function serverAuth(request: express.Request, response: express.Response, next: () => void): void {
    return new ServerAuth().auth(request, response, next);
}

export function playerAuth(request: express.Request, response: express.Response, next: () => void): void {
    return new PlayerAuth().auth(request, response, next);
}