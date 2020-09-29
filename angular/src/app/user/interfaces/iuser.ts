export interface IUser {
  fName?: string;
  lName?: string;
  email: string;
  phone?: string;
  bDay?: number;
  type?: string;
  pWord?: string;
  lastSeen?: number;
  token?: string;
}

export enum ERole {
  User = 'Client',
  Admin = 'Admin',
  Business = 'Business Owner',
  Unsigned = 'Unsigned User'
}

export const emptyUser = (): IUser => ({
  fName: '',
  lName: '',
  email: '',
  phone: '',
  bDay: 0,
  type: 'Client',
  pWord: '',
  lastSeen: 0,
});

export const updateLastSeen = (userEmail: string, date: number): IUser => ({
  email: userEmail,
  lastSeen: date,
});



