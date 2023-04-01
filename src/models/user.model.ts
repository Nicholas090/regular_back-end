import { Prisma } from '@prisma/client';

const userWithPosts = Prisma.validator<Prisma.UserArgs>()({
  select: { id: true, email: true, password : true, name: true, nickname: true, role: true, posts: true },
});

const userWithoutPosts = Prisma.validator<Prisma.UserArgs>()({
  select: { id: true, email: true, password : true, name: true, nickname: true, role: true, posts: false },
});
export type UserWithPostsModel = Prisma.UserGetPayload<typeof userWithPosts>;
export type UserWithoutPostsModel = Prisma.UserGetPayload<typeof userWithoutPosts>;
