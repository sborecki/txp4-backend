import * as mongoose from 'mongoose';


const perfPartSchema: mongoose.Schema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: 'Please provide Item ID' },
    vendor_id: { type: String, enum: ['poziofon','kamylland','sebbco','byzio','botaker','kemotium'] },
    perfparttype_id: { type: String, enum: ['engine','transmission','tires'] },
    tier: { type: Number, min: 1, max: 3 },
    imageUri: { type: String },
    maxspeed: { type: Number },
    accel: { type: Number },
    steering: { type: Number },
    breaking: { type: Number },
    turboaccel: { type: Number },
    turbodur: { type: Number },
    driftairdecel: { type: Number },
    grav: { type: Number },
    waterbounce: { type: Number }
});

export = mongoose.model('PerfParts', perfPartSchema);