import { injectable, inject } from 'inversify';
import { NextFunction, Request, Response } from 'express';
import ILogger from '../logger/logger.service.interface';
import TYPES  from '../Types';
import { TypedRequestBody } from '../requestType';
import { CreatePostBody, DeletePostBody, GetPostsBody, UpdatePostByIdBody } from '../request.interfaces';
import IPostController from './interfaces/post.controller.interface';
import 'reflect-metadata';
import IPostService from '../services/interfaces/post.service.interface';

@injectable()
class PostController implements IPostController {
  constructor(
    @inject(TYPES.ILogger) private logger: ILogger,
    @inject(TYPES.PostService) private postService: IPostService,
  ) {}

  async create(req: TypedRequestBody<CreatePostBody>, res: Response, next: NextFunction): Promise<Response> {
    try {
      this.logger.log('create');

      const { authorId, title, content, imageUrl } = req.body;

      const post = await this.postService.create({ authorId, title, content, imageUrl });

      return res.json(post);
    } catch (e) {
      next(e);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<Response>  {
    try {
      this.logger.log('getById');

      const id = +req.params.id;
      const post = await this.postService.getById({ id });

      return res.json(post);
    } catch (e) {
      next(e);
    }
  }

  async getPosts(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      this.logger.log('getPosts');

      const { page, perPage } = req.query;
      const posts = await this.postService.getPosts({ page: +page, perPage: +perPage });

      return res.json(posts);
    } catch (e) {
      next(e);
    }
  }

  async getRandomPost(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      this.logger.log('getRandomPost');

      const post = await this.postService.getRandomPost();

      return res.json(post);
    } catch (e) {
      next(e);
    }
  }

  async update(req: TypedRequestBody<UpdatePostByIdBody>, res: Response, next: NextFunction): Promise<Response> {
    try {
      this.logger.log('update');

      const { id, content, title, imageUrl } = req.body;
      const post = await this.postService.update({ id, content, title, imageUrl });

      return res.json(post);
    } catch (e) {
      next(e);
    }
  }

  async delete(req: TypedRequestBody<DeletePostBody>, res: Response, next: NextFunction): Promise<Response> {
    try {
      this.logger.log('delete');

      const { id } = req.body;
      const post = await this.postService.update({ id });

      return res.json(post);
    } catch (e) {
      next(e);
    }
  }
}

export default PostController;
