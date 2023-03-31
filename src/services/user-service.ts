import bcrypt from 'bcrypt';
import IUserService, { IUserServiceReturn } from './interfaces/user.service.interface';
import ApiError from '../exceptions/api.error';
import { inject, injectable } from 'inversify';
import { TYPES } from '../Types';
import ITokenService from './interfaces/token.service.interface';
import 'reflect-metadata';
import prisma from '../prisma';

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.TokenService) private TokenService: ITokenService,
  ) {}
  async registration(
    email: string,
    password: string,
    userNickName: string,
    userName: string,
  ): Promise<IUserServiceReturn> {
    const candidate = await prisma.user.findUnique({ where: { email } });
    if (candidate) {
      ApiError.BadRequest(`User with this Email: ${email} already exists`);
    }
    const hashPassword = await bcrypt.hash(password, 3);
    const user = await prisma.user.create({ data: {
      email,
      password: hashPassword,
      nickname: userNickName,
      name: userName,
      // TODO: hardcode
      role: 'user',
      // @ts-ignore
      posts: [],
    },  select: {
      id: true,
      email: true,
      name: true,
      role: true,
      password: false,
      posts: false,
      nickname: true,
      token: false,
    } });

    const tokens = this.TokenService.generateToken({ ...user });
    await this.TokenService.saveToken(user.id, tokens.refreshToken);

    return {
      ...tokens,
      user,
    };
  }

  async login(email: string, password: string): Promise<IUserServiceReturn> {
    const user = await prisma.user.findUnique(
      { where: { email }, select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: true,
        posts: false,
        nickname: true,
        token: true,
      } });
    if (!user) {
      ApiError.BadRequest('User not found');
    }
    const isPassEqual = await bcrypt.compare(password, user.password);
    if (!isPassEqual) {
      ApiError.BadRequest(
        'Incorrect password or email. Please try again',
      );
    }

    const tokens = this.TokenService.generateToken({ user });

    await this.TokenService.saveToken(user.id, tokens.refreshToken);
    return {
      ...tokens,
      user,
    };
  }

  async logout(refreshToken: string): Promise<object> {
    return this.TokenService.removeToken(refreshToken);
  }

  async refresh(refreshToken: string): Promise<IUserServiceReturn> {
    if (!refreshToken) {
      ApiError.UnauthorizedError();
    }
    const userData = this.TokenService.validateRefreshToken(refreshToken);
    const user = await prisma.user.findUnique({ where: { id: (userData as any).id }, select: {
      id: true,
      email: true,
      name: true,
      role: true,
      password: true,
      posts: false,
      nickname: true,
      token: true,
    } });

    const tokenFromDb = await this.TokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb || !user) {
      ApiError.UnauthorizedError();
    }


    const tokens = this.TokenService.generateToken({ ...user });

    await this.TokenService.saveToken(user.id, tokens.refreshToken);
    return {
      ...tokens,
      user,
    };
  }

}
