import { Location } from './location';
import { Car } from './car';
import { User } from './user';

export interface Membership {
  id: number;
  start: Date;
  end: Date;
  user: User;
  car: Car;
  location: Location;
  membershipType: MembershipType;
  price: number;
}

export interface MembershipType {
  id: number;
  type: string;
  price: number;
}
