import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { RaceResult } from './RaceResult'

@Entity()
class Race {
  @PrimaryGeneratedColumn('uuid')
    id?: string

  @Column('varchar', { length: 100 })
    name?: string

  @OneToMany(() => RaceResult, raceResult => raceResult.race)
    raceResults?: RaceResult[]
}

export { Race }