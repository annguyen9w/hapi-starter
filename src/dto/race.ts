import { RaceResultDTO } from './race-result'

export class RaceDTO {
  id?: string

  name?: string

  raceResults?: Array<RaceResultDTO>
}