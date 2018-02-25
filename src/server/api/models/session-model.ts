import * as mongoose from 'mongoose';
import { ISessionModel } from './session-model-interface';

const sessionSchema: mongoose.Schema = new mongoose.Schema({
    raceCount: {
        type: Number,
        min: 0,
        default: 0,
        required: true,
    },
    txpMultipiler: {
        type: Number,
        min: 0,
        default: 1,
        required: true,
    },
    perfPartRarityMultipiler: {
        type: Number,
        min: 1,
        default: 1,
        required: true,
    },
});

const model: mongoose.Model<ISessionModel> = mongoose.model('Sessions', sessionSchema);
export = model;
