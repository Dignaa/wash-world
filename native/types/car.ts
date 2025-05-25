import { Wash } from './wash';
import { Membership } from './membership';

export interface Car {
  id: number;
  registrationNumber: string;
  washes: Wash[];
  memberships: Membership[];
}
