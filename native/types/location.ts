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
