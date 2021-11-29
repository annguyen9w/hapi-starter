import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class Address {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column('varchar', { nullable: true, length: 150 })
  street?: string;

  @Column('varchar', { nullable: true, length: 150 })
  street2?: string;

  @Column('varchar', { length: 100 })
  city?: string;

  @Column('varchar', { length: 50 })
  state?: string;

  @Column('varchar', { length: 20 })
  zipcode?: string;

  @Column('varchar', { length: 100 })
  country?: string;
}

export { Address }
