export interface Wash {
  id: number;
  car: string;
  location: string;
  washType: string;
  date: string;
  rating: number;
}
export interface WashType {
  id: number;
  type: string;
  price: number;
}
export interface CreateWashDto {
  carId?: number;
  licensePlate?: string;
  userId: number | null;
  locationId: number;
  washTypeId: number;
}
export interface WashResponse {
  id: number;
  carId: number;
  userId: number | null;
  locationId: number;
  time: string;
  washTypeId: number;
  emergencyStop: boolean;
  rating?: number;
}

export interface User {
  id: number;
  name?: string;
  phoneNumber?: string;
  email: string;
  memberships: Membership[];
  washes: Wash[];
}

export interface Membership {
  id: number;
  start: Date;
  end: Date;
  user: User;
  car: Car;
  location: Location;
  membershipType: MembershipType;
}
export interface MembershipType {
  id: number;
  type: string;
  price: number;
}

export interface Location {
  id: number;
  address: string;
  y: number;
  x: number;
  maxWheelWidth: number;
  height: number;
  selfWashes: number;
  washHalls: number;
  openTo: string;
  openFrom: string;
  imageUrl: string;
  link: string;
  status: 'operational' | 'maintenance' | 'closed';
  distance?: number;
}

export interface Car {
  id: number;
  registrationNumber: string;
  washes: Wash[];
  memberships: Membership[];
}
