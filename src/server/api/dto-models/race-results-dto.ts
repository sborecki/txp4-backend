export interface RaceResultsDTO {
    environment: string,
    perfPartBonus: number,
    txpBonus: number,
    results: [RacePositionDTO]
}

interface RacePositionDTO {
    playerLogin: string,
    position: number,
    time: number
}