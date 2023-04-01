import { Prisma } from '@prisma/client';

const tokenWithoutUser = Prisma.validator<Prisma.TokenArgs>()({
  select: { id: true,  refreshToken: true, userId: true, user: false }
});

const tokenWithUser = Prisma.validator<Prisma.TokenArgs>()({
  select: { id: true,  refreshToken: true, userId: true, user: true }
});

export type TokenWithUserModel = Prisma.TokenGetPayload<typeof tokenWithUser>;
export type TokenWithoutUserModel = Prisma.TokenGetPayload<typeof tokenWithoutUser>;
