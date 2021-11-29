import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, OneToMany, ManyToOne } from 'typeorm'
import { Address } from './Address'
import { RaceResult } from './RaceResult'
import { Team } from './Team'

export enum NationalityType {
  usa = 'USA',
  vietnam = 'Viet Nam'
}

@Entity()
class Driver {
  @PrimaryGeneratedColumn('uuid')
    id?: string

  @Column('varchar', { length: 40 })
    firstName?: string

  @Column('varchar', { length: 40 })
    lastName?: string

  @Column({
    type: 'enum',
    enum: NationalityType
  })
    nationality?: NationalityType
  
  @ManyToOne(() => Address, address => address.id, { onDelete: 'SET NULL' })
    homeAddress?: Address

  @ManyToOne(() => Address, address => address.id, { onDelete: 'SET NULL' })
    managementAddress?: Address

  @ManyToMany(() => Team, team => team.drivers, { onDelete: 'CASCADE' })
    teams?: Team[]

  @OneToMany(() => RaceResult, raceResult => raceResult.driver)
    raceResults?: RaceResult[]
}

export { Driver }