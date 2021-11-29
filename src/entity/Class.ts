import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
class Class {
  @PrimaryGeneratedColumn('uuid')
    id?: string

  @Column('varchar', { length: 100 })
    name?: string
}

export { Class }