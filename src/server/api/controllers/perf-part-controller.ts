import * as express from 'express';

export function dummy(request: express.Request, response: express.Response): void {
    response.send("Kemot");
}