import { LoginBody, RegistrationBody } from '../../request.interfaces';

export default interface IUserService {
  registration: (data: RegistrationBody) => Promise<IUserServiceReturn>;
  login: (data: LoginBody) => Promise<IUserServiceReturn>;
  logout: (refreshToken: string) => Promise<object>;
  refresh: (refreshToken: string) => Promise<IUserServiceReturn>;
}

export interface IUserServiceReturn {
  refreshToken: string;
  accessToken: string;
  user: {
    id: number,
    email: string
    name: string,
    nickname: string
    role: string,
  };
}
