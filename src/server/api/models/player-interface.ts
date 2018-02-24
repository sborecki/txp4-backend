import * as mongoose from 'mongoose';

export interface IPlayer {
    _id: any;
    playerlogin: string;
    txp: number;
    slot1: mongoose.Schema.Types.ObjectId;
    slot2: mongoose.Schema.Types.ObjectId;
    slot3: mongoose.Schema.Types.ObjectId;
    inventory: mongoose.Schema.Types.ObjectId[];
}
