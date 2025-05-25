import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Car } from '../../cars/entities/car.entity';
import { Location } from '../../locations/entities/location.entity';
import { WashType } from '../../wash-types/entities/wash-type.entity';

@Entity()
export class Wash {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Car, (car) => car.id)
  car: Car;

  @ManyToOne(() => User, (user) => user.washes)
  user?: User;

  @ManyToOne(() => Location, (location) => location.washes)
  location: Location;

  @ManyToOne(() => WashType, (washType) => washType.washes)
  washType: WashType;

  @Column()
  time: Date;

  @Column({ type: 'float', nullable: true })
  rating: number;

  @Column({ default: false })
  emergencyStop: boolean;
}
