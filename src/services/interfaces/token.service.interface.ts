import { IJwtPayload } from '../../request.interfaces';
import { TokenWithoutUserModel } from '../../models/token.model';

interface ITokens {
  accessToken: string;
  refreshToken: string;
}

export default interface ITokenService {
  generateToken: (payload: IJwtPayload) => ITokens;
  saveToken: (userId: number, refreshToken: unknown) => Promise<void>;
  removeToken: (refreshToken: string) => Promise<TokenWithoutUserModel>;
  findToken: (refreshToken: string) => Promise<TokenWithoutUserModel>;
  validateAccessToken: (token: string) =>  IJwtPayload | string;
  validateRefreshToken: (token: string) =>  IJwtPayload | string;
}
