import * as mongoose from 'mongoose';
import * as random from 'mongoose-simple-random';
import { IPerfPartModel } from './perf-part-model-interface';

const perfPartSchema: mongoose.Schema = new mongoose.Schema({
    vendor: {
        type: String,
        enum: ['Sebb. Co.', 'Poziofon Technologies', 'byZio Industries', 'Botaker Systems', 'KemotiumOre', 'Kamyl&Bugz'],
        required: true
    },
    perfparttype: {
        type: String,
        enum: ['engine', 'transmission', 'tires'],
        required: true
    },
    tier: {
        type: Number,
        min: 1,
        max: 3,
        required: true
    },
    imageUri: {
        type: String
    },
    maxspeed: {
        type: Number,
        default: 0,
        required: true
    },
    accel: {
        type: Number,
        default: 0,
        required: true
    },
    steering: {
        type: Number,
        default: 0,
        required: true
    },
    breaking: {
        type: Number,
        default: 0,
        required: true
    },
    turboaccel: {
        type: Number,
        default: 0,
        required: true
    },
    turbodur: {
        type: Number,
        default: 0,
        required: true
    },
    driftairdecel: {
        type: Number,
        default: 0,
        required: true
    },
    grav: {
        type: Number,
        default: 0,
        required: true
    },
    waterbounce: {
        type: Number,
        default: 0,
        required: true
    }
});
perfPartSchema.plugin(random);

const model: mongoose.Model<IPerfPartModel> = mongoose.model('PerfParts', perfPartSchema);
export = model;