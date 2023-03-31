import { Prisma } from '@prisma/client';

export const postModel = Prisma.validator<Prisma.PostArgs>()({});
export type PostModel = Prisma.TokenGetPayload<typeof postModel>;
