import * as mongoose from 'mongoose';

const playerSchema: mongoose.Schema = new mongoose.Schema({
    playerlogin: {
        type: String,
        unique: true,
        required: true
    },
    txp: {
        type: Number,
        min: 0,
        default: 0,
        required: true
    },
    slot1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PerfParts'
    },
    slot2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PerfParts'
    },
    slot3: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PerfParts'
    },
    inventory: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'PerfParts'
    }
});

const model: mongoose.Model<mongoose.Document> = mongoose.model('Players', playerSchema);
export = model;