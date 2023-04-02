import * as bcrypt from 'bcrypt';
import IUserService, { IUserServiceReturn } from './interfaces/user.service.interface';
import ApiError from '../exceptions/api.error';
import { inject, injectable } from 'inversify';
import  TYPES  from '../Types';
import ITokenService from './interfaces/token.service.interface';
import prisma from '../prisma';
import { LoginBody, RegistrationBody } from '../request.interfaces';
import { UserWithoutPostsModel } from '../models/user.model';
import { IJwtPayload } from '../request.interfaces';
import 'reflect-metadata';
@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.TokenService) private TokenService: ITokenService,
  ) {}
  async registration(
    {
      email,
      password,
      name,
      nickname,
    }: RegistrationBody,
  ): Promise<IUserServiceReturn> {
    try {
      const candidate = await prisma.user.findUnique({ where: { email } });
      if (candidate) {
        ApiError.BadRequest(`User with this Email: ${email} already exists`);
      }

      const hashPassword = await bcrypt.hash(password, 11 );
      const user = await prisma.user.create({ data: ({
        email,
        password: hashPassword,
        nickname,
        name,
        role: 'user',
      } as unknown as UserWithoutPostsModel),  select: {
        id: true,
        email: true,
        name: true,
        role: true,
        nickname: true,
      } });

      const tokens = this.TokenService.generateToken({ ...user });
      await this.TokenService.saveToken(user.id, tokens.refreshToken);

      return {
        ...tokens,
        user,
      };
    } catch (e) {
      console.log(e);
      ApiError.InternalError(e);
    }
  }

  async login({ email, password, nickname }: LoginBody): Promise<IUserServiceReturn> {
    try {
      const user = await prisma.user.findUnique(
        { where: { email }, select: {
          id: true,
          email: true,
          name: true,
          role: true,
          password: true,
          nickname: true,
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

      delete user.password;

      const tokens = this.TokenService.generateToken({ id: user.id });
      await this.TokenService.saveToken(user.id, tokens.refreshToken);

      return {
        ...tokens,
        user,
      };
    } catch (e) {
      ApiError.InternalError(e);
    }
  }

  async logout(refreshToken: string): Promise<object> {
    return this.TokenService.removeToken(refreshToken);
  }

  async refresh(refreshToken: string): Promise<IUserServiceReturn> {
    try {
      if (!refreshToken) {
        ApiError.UnauthorizedError();
      }
      const userData = this.TokenService.validateRefreshToken(refreshToken);
      if (typeof userData === 'string') {
        ApiError.InternalError('Something went wrong');
      }
      const user = await prisma.user.findUnique({ where: { id: (userData as IJwtPayload).id }, select: {
        id: true,
        email: true,
        name: true,
        role: true,
        nickname: true,
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
    } catch (e) {
      ApiError.InternalError(e);
    }
  }

}
