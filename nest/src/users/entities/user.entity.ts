import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Car } from '../../cars/entities/car.entity';
import { Membership } from '../../memberships/entities/membership.entity';
import { Wash } from '../../washes/entities/wash.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Membership, (membership) => membership.user)
  memberships: Membership[];

  @OneToMany(() => Wash, (wash) => wash.user)
  washes: Wash[];
}
