import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { Class } from './Class'
import { RaceResult } from './RaceResult'
import { Team } from './Team'

@Entity()
class Car {
  @PrimaryGeneratedColumn('uuid')
    id?: string

  @Column('varchar', { length: 40 })
    make?: string

  @Column('varchar', { length: 40 })
    model?: string

  // @Column('varchar', {
  //     nullable: false,
  //     length: 10,
  //     name: 'color'
  // })
  // color?: string;    

  // @Column('int', {
  //     nullable: false,
  //     name: 'entrynumber'
  // })
  // entryNumber?: number;

  @ManyToOne(() => Class)
    class?: Class

  @ManyToOne(() => Team, team => team.cars)
    team?: Team

  @OneToMany(() => RaceResult, raceResult => raceResult.car)
    raceResults?: RaceResult[]
}

export { Car }