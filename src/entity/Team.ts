import { Column, Entity, PrimaryGeneratedColumn, OneToMany, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { Address } from './Address';
import { Car } from './Car';
import { Driver } from './Driver';

export enum NationalityType {
  usa = 'USA',
  vietnam = 'Viet Nam'
}

@Entity()
class Team {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column('varchar', { length: 100 })
  name?: string;

  @Column({
    type: 'enum',
    enum: NationalityType
  })
  nationality?: NationalityType;    

  @ManyToOne(() => Address, address => address.id, { onDelete: 'SET NULL' })
  businessAddress?: Address;

  @ManyToMany(() => Driver, driver => driver.teams, { cascade: true })
  @JoinTable()
  drivers?: Driver[];

  @OneToMany(() => Car, car => car.team)
  cars?: Car[]
}

export { Team }