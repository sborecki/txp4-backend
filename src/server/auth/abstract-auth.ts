import * as express from 'express';

export abstract class AbstractAuth {

    protected abstract checkAuth(login: String, pass: String): Promise<boolean>;
    protected nextAuthResponsible: AbstractAuth;

    constructor(responsible: AbstractAuth) {
        this.nextAuthResponsible = responsible;
    }

    public auth(request: express.Request, response: express.Response, next: () => void): void {
        this.checkAuth(this.getLogin(request), this.getPass(request))
            .then(function (isAuthorized: boolean) {
                if (isAuthorized) {
                    return next();
                } else if (this.nextAuthResponsible != null) {
                    this.nextAuthResponsible.auth(request, response, next);
                } else {
                    response.sendStatus(401);
                }
            });
    }

    private getLogin(request: express.Request): String {
        if (request.params.playerLogin !== undefined && request.params.playerLogin instanceof String) {
            return request.params.playerLogin;
        }
        return '';
    }

    private getPass(request: express.Request): String {
        if (request.query.pass !== undefined) {
            return request.query.pass;
        }
        return '';
    }

}