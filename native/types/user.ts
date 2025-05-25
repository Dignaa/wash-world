import { Membership } from './membership';
import { Wash } from './wash';

export interface User {
  id: number;
  name?: string;
  phoneNumber?: string;
  email: string;
  password: string;
  memberships: Membership[];
  washes: Wash[];
}
