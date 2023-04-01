import { Prisma } from '@prisma/client';

const userWithPosts = Prisma.validator<Prisma.UserArgs>()({
  include: { posts: true },
});

const userWithoutPosts = Prisma.validator<Prisma.UserArgs>()({
  include: { posts: false },
});
export type UserWithPostsModel = Prisma.UserGetPayload<typeof userWithPosts>;
export type UserWithoutPostsModel = Prisma.UserGetPayload<typeof userWithoutPosts>;
