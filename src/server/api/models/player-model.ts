import * as mongoose from 'mongoose';

const playerSchema: mongoose.Schema = new mongoose.Schema({
    playerlogin: { type: String, unique: true, required: 'Playerlogin is required' },
    slot1: { type: mongoose.Schema.Types.ObjectId, ref: 'PerfParts' },
    slot2: { type: mongoose.Schema.Types.ObjectId, ref: 'PerfParts' },
    slot3: { type: mongoose.Schema.Types.ObjectId, ref: 'PerfParts' },
    inventory: { type: [mongoose.Schema.Types.ObjectId], ref: 'PerfParts' }
});

export = mongoose.model('Players', playerSchema);