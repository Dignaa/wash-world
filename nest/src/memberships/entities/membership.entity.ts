import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Membership {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  start: Date;

  @Column()
  end: Date;

  @Column()
  type: 'gold' | 'premium' | 'brilliant';

  @ManyToOne(() => User, user => user.memberships)
  user: User;
}
