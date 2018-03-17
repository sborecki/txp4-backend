import { AbstractAuth } from './abstract-auth';

export class AdminAuth extends AbstractAuth {

    constructor() {
        super(null);
        //this.checkAuth = this.checkAuth.bind(this);
    }

    protected checkAuth(login: String, pass: String): Promise<boolean> {
        return Promise.resolve(pass === process.env.ADMIN_AUTH_SECRET);
    }

}