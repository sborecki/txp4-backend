import * as express from 'express';

export default function renderSinglePageApplicationHandler(request: express.Request, response: express.Response) {
    response.render('index', {
        title: 'TrackMania Experience',
    });
}
