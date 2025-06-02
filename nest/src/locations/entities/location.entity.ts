import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Wash } from '../../washes/entities/wash.entity';
import { Membership } from '../../memberships/entities/membership.entity';

@Entity()
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  address: string;

  @Column('float')
  y: number;

  @Column('float')
  x: number;

  @Column('float')
  maxWheelWidth: number;

  @Column('float')
  height: number;

  @Column()
  selfWashes: number;

  @Column()
  washHalls: number;

  @Column()
  openTo: string;

  @Column()
  openFrom: string;

  @Column()
  imageUrl: string;

  @Column()
  status: string;

  @OneToMany(() => Wash, (wash) => wash.location)
  washes: Wash[];

  @OneToMany(() => Membership, (membership) => membership.location)
  memberships: Membership[];
}
