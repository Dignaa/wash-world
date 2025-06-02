import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Wash } from '../../washes/entities/wash.entity';
import { Membership } from '../../memberships/entities/membership.entity';

@Entity()
export class Car {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  registrationNumber: string;

  @OneToMany(() => Wash, (wash) => wash.car)
  washes: Wash[];

  @OneToMany(() => Membership, (membership) => membership.car)
  memberships: Membership[];
}
