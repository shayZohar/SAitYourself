import { IUser, emptyUser } from '@/user/interfaces/iuser';

/**
 * user list selection interface
 */
export interface IUserListSelection {
  selectedUser: IUser;
  selectedType: string;
}

export const userListSelection = (user = emptyUser(), type = ''): IUserListSelection => ({
  selectedUser: user,
  selectedType: type
});
