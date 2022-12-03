export interface IUser {
  id: string;
  email: string;
  role: IRole;
  lastLoginTime: Date;
}
export type IRole = 'admin' | 'user' | 'patient';