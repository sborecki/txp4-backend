import * as mongoose from 'mongoose';

export interface IPlayer {
    _id: any;
    playerlogin: string;
    txp: number;
    slotengine: mongoose.Schema.Types.ObjectId;
    slottransmission: mongoose.Schema.Types.ObjectId;
    slottires: mongoose.Schema.Types.ObjectId;
    inventory: mongoose.Schema.Types.ObjectId[];
}
