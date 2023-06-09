import {
  CreatePostBody,
  DeletePostBody,
  GetPostsBody,
  GetPostsResponse,
  UpdatePostByIdBody,
} from '../../request.interfaces';
import { PostWithoutAuthorModel } from '../../models/post.model';

export default interface IPostService {
  create: (data: CreatePostBody) => Promise<PostWithoutAuthorModel>;
  getById: (data: { id: number }) => Promise<PostWithoutAuthorModel>;
  getPosts: (data: GetPostsBody) => Promise<GetPostsResponse>;
  getRandomPost: () => Promise<PostWithoutAuthorModel>;
  update: (data: UpdatePostByIdBody) => Promise<PostWithoutAuthorModel>;
  delete: (data: DeletePostBody) => void;
}
