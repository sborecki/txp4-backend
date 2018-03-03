import * as mongoose from 'mongoose';

export interface IPerfPart {
    _id: any;
    vendor: Vendor;
    perfparttype: PartType;
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

type PartType = 'engine' | 'transmission' | 'tires';
type Vendor = 'Sebb. Co.' | 'Poziofon Technologies' | 'byZio Industries' | 'Botaker Systems' | 'KemotiumOre' | 'Kamyl&Bugz';