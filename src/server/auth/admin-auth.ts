import { AbstractAuth } from './abstract-auth';

export class AdminAuth extends AbstractAuth {

    protected nextAuthResponsible = null;

    protected checkAuth(login: String, pass: String): Promise<boolean> {
        return Promise.resolve(pass === process.env.ADMIN_AUTH_SECRET);
    }

}