import * as express from 'express';

export default function pageNotFoundHandler(request: express.Request, response: express.Response) {
    response.status(404).render('404');
}
