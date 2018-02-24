import { RacePositionDTO } from './race-position-dto';

export class RaceResultsDTO {
    public environment: string;
    public authorTime: number;
    public perfPartFindMultipiler: number;
    public txpPointsMultipiler: number;
    public results: RacePositionDTO[];
}
