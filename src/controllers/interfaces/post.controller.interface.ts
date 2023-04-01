import { NextFunction, Response } from 'express';
import { TypedRequestBody } from '../../requestType';
import { CreatePostBody, DeletePostBody, GetByIdPostBody, GetPostsBody, UpdatePostByIdBody } from '../../request.interfaces';

export default interface IPostController {
  create: (req: TypedRequestBody<CreatePostBody>, res: Response, next: NextFunction) => void;
  getById: (req: TypedRequestBody<GetByIdPostBody>, res: Response, next: NextFunction) => void;
  getPosts: (req: TypedRequestBody<GetPostsBody>, res: Response, next: NextFunction) => void;
  update: (req: TypedRequestBody<UpdatePostByIdBody>, res: Response, next: NextFunction) => void;
  delete: (req: TypedRequestBody<DeletePostBody>, res: Response, next: NextFunction) => void;
}
