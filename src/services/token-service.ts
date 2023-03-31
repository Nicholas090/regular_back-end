import { JwtPayload, Secret, sign, verify } from 'jsonwebtoken';
import ITokenService from './interfaces/token.service.interface';
import { injectable } from 'inversify';
import 'reflect-metadata';
import prisma from '../prisma';

@injectable()
class TokenService implements ITokenService {


  generateToken(payload: unknown): { accessToken: string; refreshToken: string } {
	  // Todo: update interface for payload
    const accessToken = sign((payload as object), process.env.JWT_ACCESS_SECRET as Secret, {
      expiresIn: '30m',
    });
    const refreshToken = sign((payload as object), process.env.JWT_REFRESH_SECRET as Secret, {
      expiresIn: '30d',
    });
    return {
      accessToken,
      refreshToken,
    };
  }
  async saveToken(userId: number, refreshToken: string): Promise<void> {
    const tokenData = await prisma.token.findUnique({ where: { userId } });

    if (tokenData) {
      await prisma.token.update({ where: { userId }, data: { refreshToken } });
      return;
    }
    await prisma.token.create( { data: { userId, refreshToken } });
  }

  validateAccessToken(token: string): string | JwtPayload | null {
    try {
      return verify(token, process.env.JWT_ACCESS_SECRET);
    } catch (e) {
      return null;
    }
  }

  validateRefreshToken(token: string): string | JwtPayload | null {
    try {
      return verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async findToken(refreshToken: string): Promise<object> {
    return prisma.token.findUnique({ where: { refreshToken } });
  }

  async removeToken(refreshToken: string): Promise<object> {
    return prisma.token.delete({ where: { refreshToken } });
  }
}

export default TokenService;
