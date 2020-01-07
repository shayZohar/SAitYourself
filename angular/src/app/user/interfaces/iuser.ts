export interface IUser {
  fName?: string;
  lName?: string;
  email: string;
  phone?: string;
  bDay?: string;
  type?: string;
  pWord: string;
  token?: string;
}

export enum ERole {
  User = 'Client',
  Admin = 'Admin',
  Business = 'Business Owner'
}

export const emptyUser = (): IUser => ({
  fName: '',
  lName: '',
  email: '',
  phone: '',
  bDay: '',
  type: 'Client',
  pWord: '',

});
