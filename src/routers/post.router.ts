import authMiddleware from '../middlewares/auth.middleware';
import { Router } from 'express';
import { inject, injectable } from 'inversify';
import TYPES  from '../Types';
import IPostController from '../controllers/interfaces/post.controller.interface';
import 'reflect-metadata';
import { validatePostRequestBody } from '../middlewares/validate.post.middleware';

@injectable()
class PostRouter {
  constructor(
    @inject(TYPES.PostController) private postController: IPostController,
  ) {
  }

  init() {
    const router: Router = Router();
    router.post('/create', authMiddleware, validatePostRequestBody, this.postController.create.bind(this.postController) as IPostController['create']);
    router.get('/post/:id', this.postController.getById.bind(this.postController) as IPostController['getById']);
    router.get('/posts', this.postController.getPosts.bind(this.postController) as IPostController['getPosts']);
    router.patch('/update', authMiddleware, this.postController.update.bind(this.postController) as IPostController['update']);
    router.delete('/delete', authMiddleware, this.postController.delete.bind(this.postController) as IPostController['delete']);
    return router;
  }

}

export default PostRouter;
