import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Location } from '../../locations/entities/location.entity';
import { MembershipType } from '../../membership-types/entities/membership-type.entity';
import { Car } from '../../cars/entities/car.entity';

@Entity()
export class Membership {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  start: Date;

  @Column()
  end: Date;

  @ManyToOne(() => User, user => user.memberships)
  user: User;

  @ManyToOne(() => Car, car => car.memberships)
  car: Car;

  @ManyToOne(() => Location, location => location.memberships)
  location: Location;

  @ManyToOne(() => MembershipType, membershipType => membershipType.membership)
  membershipType: MembershipType;
}
