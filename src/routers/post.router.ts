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
    router.post('/create', authMiddleware, validatePostRequestBody , this.postController.create.bind(this.postController));
    router.get('/post/:id', this.postController.getById.bind(this.postController));
    router.get('/posts', this.postController.getPosts.bind(this.postController));
    router.patch('/update', authMiddleware ,this.postController.update.bind(this.postController));
    router.delete('/delete', authMiddleware.bind(authMiddleware), this.postController.delete.bind(this.postController));
    return router;
  }

}

export default PostRouter;
