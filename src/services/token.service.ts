import { injectable } from 'inversify';
import { Secret, sign, verify } from 'jsonwebtoken';
import ITokenService from './interfaces/token.service.interface';
import prisma from '../prisma';
import { IJwtPayload } from '../request.interfaces';
import { TokenWithoutUserModel } from '../models/token.model';
import 'reflect-metadata';
@injectable()
class TokenService implements ITokenService {
  generateToken(payload: IJwtPayload): { accessToken: string; refreshToken: string } {
	  // Todo: update interface for payload
    const accessToken = sign(payload, process.env.JWT_ACCESS_SECRET as Secret, {
      expiresIn: '30m',
    });
    const refreshToken = sign(payload, process.env.JWT_REFRESH_SECRET as Secret, {
      expiresIn: '30d',
    });
    return {
      accessToken,
      refreshToken,
    };
  }
  async saveToken(userId: number, refreshToken: string): Promise<void> {
    try {
      const tokenData = await prisma.token.findUnique({ where: { userId } });
      if (tokenData) {
        await prisma.token.update({ where: { userId }, data: { refreshToken } });
        return;
      }
      await prisma.token.create( { data: { userId, refreshToken } });
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  validateAccessToken(token: string):  IJwtPayload | string  {
    try {
      return verify(token, process.env.JWT_ACCESS_SECRET) as IJwtPayload;
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  validateRefreshToken(token: string): IJwtPayload | string {
    try {
      return verify(token, process.env.JWT_REFRESH_SECRET) as IJwtPayload;
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  async findToken(refreshToken: string): Promise<TokenWithoutUserModel> {
    try {
      const tokenData = await prisma.token.findFirst(
        { where: { refreshToken },
          select: { refreshToken: true, userId: true, id: true },
        });
      return tokenData;
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  async removeToken(refreshToken: string): Promise<TokenWithoutUserModel> {
    try {
      const { id } = await prisma.token.findFirst(
        { where: { refreshToken },
          select: {  id: true },
        });

      const deleteTokeData = await prisma.token.delete(
        { where: { id },
          select: { refreshToken: true, userId: true, id: true },
        });
      return deleteTokeData;
    } catch (e) {
      console.log(e);
      return e;
    }
  }
}

export default TokenService;
