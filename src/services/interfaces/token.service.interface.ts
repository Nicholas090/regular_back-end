import { JwtPayload } from 'jsonwebtoken';

interface ITokens {
  accessToken: string;
  refreshToken: string;
}

export default interface ITokenService {
  generateToken: (payload: unknown) => ITokens;
  saveToken: (userId: number, refreshToken: unknown) => unknown;
  removeToken: (refreshToken: string) => Promise<object>;
  findToken: (refreshToken: string) => Promise<object>;
  validateAccessToken: (token: string) => string | JwtPayload | null;
  validateRefreshToken: (token: string) => string | JwtPayload | null;
}
