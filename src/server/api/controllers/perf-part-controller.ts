import * as express from 'express';
import * as mongoose from 'mongoose';
import * as PerfPartModel from '../models/perf-part-model';

export function getPerfPartById(request: express.Request, response: express.Response): void {
    PerfPartModel.findById(request.params.perfPartId, function (error: any, document: mongoose.Document) {
        if (error)
            response.send(error);
        response.json(document);
    });
}

export function getAllPerfParts(request: express.Request, response: express.Response): void {
    PerfPartModel.find({}, function (error: any, document: mongoose.Document) {
        if (error)
            response.send(error);
        response.json(document);
    });
}