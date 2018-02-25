import * as mongoose from 'mongoose';

export interface ISession {
    _id: any;
    raceCount: number;
    txpMultipiler: number;
    perfPartRarityMultipiler: number;
}
