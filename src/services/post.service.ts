import ApiError from '../exceptions/api.error';
import { injectable } from 'inversify';
import prisma from '../prisma';
import { CreatePostBody, DeletePostBody, GetPostsBody, UpdatePostByIdBody } from '../request.interfaces';
import IPostService from './interfaces/post.service.interface';
import 'reflect-metadata';
import { PostWithoutAuthorModel } from '../models/post.model';

@injectable()
export class PostService implements IPostService {
  async create(
    {
     title,
     authorId,
     imageUrl, 
     content = '',
    }: CreatePostBody,
  ): Promise<PostWithoutAuthorModel> {
    try {
      const post = await prisma.post.create({ data: ({
        title,
        authorId,
        imageUrl, 
        content,
      }), select: { 
        id: true,
        title: true,
        authorId: true,
        imageUrl: true, 
        content: true,
      }});

      return post;
    } catch (e) {
      console.log(e);
      ApiError.InternalError(e);
    }
  }

  async getById({ id }: { id: number }): Promise<PostWithoutAuthorModel> {
    try {
      const post = await prisma.post.findUnique(
        {
         where: { id },
         select: { 
            id: true,
            title: true,
            authorId: true,
            imageUrl: true, 
            content: true,
          }}
        );
      if (!post) {
        ApiError.BadRequest('Post not found');
      }
      return post;
    } catch (e) {
      ApiError.InternalError(e);
    }
  }

  async getPosts({ page, perPage }: GetPostsBody): Promise<PostWithoutAuthorModel[]> {
    try {
        const posts = await prisma.post.findMany({
            skip: page, 
            take: perPage,
            orderBy: {
              createdAt: 'desc', 
            },
            select: { 
                id: true,
                title: true,
                authorId: true,
                imageUrl: true, 
                content: true,
              }
        })
      return posts
    } catch (e) {
      ApiError.InternalError(e);
    }
  }

  async update({ id, title, content, imageUrl }: UpdatePostByIdBody): Promise<PostWithoutAuthorModel> {
    try {
      const updatePost = await prisma.post.update(
        { 
        where: { id },
        data: {
            ...(title && { title }), 
            ...(content && { content }), 
            ...(imageUrl && { imageUrl }), 
        },
        select: {
            id: true,
            title: true,
            authorId: true,
            imageUrl: true, 
            content: true,
      } });
      return updatePost
    } catch (e) {
      ApiError.InternalError(e);
    }
  }

  async delete({ id }: DeletePostBody): Promise<PostWithoutAuthorModel> {
    try {
      const updatePost = await prisma.post.delete(
        { 
        where: { id },
        select: {
            id: true,
            title: true,
            authorId: true,
            imageUrl: true, 
            content: true,
      } });
      return updatePost
    } catch (e) {
      ApiError.InternalError(e);
    }
  }


}
