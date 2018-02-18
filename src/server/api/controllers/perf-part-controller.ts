import * as express from 'express';
import * as mongoose from 'mongoose';
import * as PerfPartModel from '../models/perf-part-model';
import { IPerfPartModel } from 'src/server/api/models/perf-part-model-interface';

export function getPerfPartById(request: express.Request, response: express.Response): void {
    PerfPartModel.findById(request.params.perfPartId, function (error: any, document: IPerfPartModel) {
        if (error)
            response.send(error);
        response.json(document);
    });
}

export function getAllPerfParts(request: express.Request, response: express.Response): void {
    PerfPartModel.find({}, function (error: any, document: IPerfPartModel) {
        if (error)
            response.send(error);
        response.json(document);
    });
}