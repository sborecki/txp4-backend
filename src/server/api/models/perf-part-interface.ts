import * as mongoose from 'mongoose';

export interface IPerfPart {
    vendor: string;
    perfparttype: string;
    tier: number;
    imageUri: string;
    maxspeed: number;
    accel: number;
    steering:number;
    breaking: number;
    turboaccel:number;
    turbodur: number;
    driftairdecel:number;
    grav: number;
    waterbounce: number;
}