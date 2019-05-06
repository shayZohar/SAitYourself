export interface IUser {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    birthDay: string;
    userType: string;
    password: string;
}

export const emptyUser = (): IUser => ({
   firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDay: '',
    userType: '',
    password: ''
});
