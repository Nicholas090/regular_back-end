import { Prisma } from '@prisma/client';

const postWithAuthor = Prisma.validator<Prisma.PostArgs>()({
  select: { id: true, title: true, content: true, authorId: true, imageUrl: true, author: true },
});
export type PostModel = Prisma.PostGetPayload<typeof postWithAuthor>;

const postWithoutAuthor = Prisma.validator<Prisma.PostArgs>()({
  select: { id: true, title: true, content: true, authorId: true, imageUrl: true },
});
export type PostWithoutAuthorModel = Prisma.PostGetPayload<typeof postWithoutAuthor>;

