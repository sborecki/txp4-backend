import * as express from 'express';
import * as mongoose from 'mongoose';
import * as PerfPartModel from '../models/perf-part-model';
import { IPerfPartModel } from '../models/perf-part-model-interface';

export function getPerfPartById(request: express.Request, response: express.Response): void {
    PerfPartModel.findById(request.params.perfPartId, function (error: any, perfPart: IPerfPartModel) {
        if (error)
            response.send(error);
        response.json(perfPart);
    });
}

export function getAllPerfParts(request: express.Request, response: express.Response): void {
    PerfPartModel.find({}, function (error: any, perfParts: IPerfPartModel[]) {
        if (error)
            response.send(error);
        response.json(perfParts);
    });

}

