export interface RaceResultsDTO {
    environment: string,
    authorTime: number,
    perfPartFindMultipiler: number,
    txpPointsMultipiler: number,
    results: RacePositionDTO[]
}

export interface RacePositionDTO {
    playerLogin: string,
    position: number,
    time: number
}