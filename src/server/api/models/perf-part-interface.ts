import * as mongoose from 'mongoose';

export interface IPerfPart {
    _id: any;
    vendor: string;
    perfparttype: string;
    tier: number;
    imageUri: string;
    maxspeed: number;
    accel: number;
    steering: number;
    breaking: number;
    turboaccel: number;
    turbodur: number;
    driftairdecel: number;
    grav: number;
    waterbounce: number;
    perfpartrarity: number;
}
