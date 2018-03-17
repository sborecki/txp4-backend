import { AbstractAuth } from './abstract-auth';
import { AdminAuth } from './admin-auth';

export class ServerAuth extends AbstractAuth {

    protected nextAuthResponsible = new AdminAuth();

    protected checkAuth(login: String, pass: String): Promise<boolean> {
        return Promise.resolve(pass === process.env.SERVER_AUTH_SECRET);
    }

}