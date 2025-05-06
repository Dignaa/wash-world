import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Wash } from '../../washes/entities/wash.entity';

@Entity()
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  address: string;

  @Column('float')
  x: number;

  @Column('float')
  y: number;

  @Column()
  status: string;

  @OneToMany(() => Wash, wash => wash.location)
  washes: Wash[];
}
