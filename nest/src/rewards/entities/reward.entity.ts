import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Reward {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  expiryDate: Date;

  @Column({ default: false })
  isRedeemed: boolean;

  @ManyToOne(() => User, user => user.rewards)
  user: User;
}
