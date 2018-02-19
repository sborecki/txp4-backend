export interface RaceResultsDTO {
    environment: string,
    authorTime: number,
    perfPartFindMultipiler: number,
    txpPointsMultipiler: number,
    results: RacePositionDTO[]
}

interface RacePositionDTO {
    playerLogin: string,
    position: number,
    time: number
}