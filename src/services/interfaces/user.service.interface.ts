export default interface IUserService {
  registration: (
    email: string,
    password: string,
    userName: string,
    userNickName: string,
  ) => Promise<IUserServiceReturn>;
  login: (email: string, password: string, userNickName?: string) => Promise<IUserServiceReturn>;
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
