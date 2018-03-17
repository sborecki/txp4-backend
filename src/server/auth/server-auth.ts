import { AbstractAuth } from './abstract-auth';
import { AdminAuth } from './admin-auth';

export class ServerAuth extends AbstractAuth {

    constructor() {
        super(new AdminAuth());
        //this.checkAuth = this.checkAuth.bind(this);
    };

    protected checkAuth(login: String, pass: String): Promise<boolean> {
        return Promise.resolve(pass === process.env.SERVER_AUTH_SECRET);
    }

}

export let serverAuth = new ServerAuth();