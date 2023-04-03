import { JwtPayload } from 'jsonwebtoken';
import { PostWithoutAuthorModel } from './models/post.model';

export interface IJwtPayload extends JwtPayload {
  id: number,
}

export interface RegistrationBody {
  email: string;
  password: string;
  nickname: string;
  name: string;
}

export interface LoginBody {
  email: string;
  password: string;
  nickname?: string;
}

export interface CreatePostBody {
  title: string;
  content: string;
  imageUrl: string;
  authorId: number;
}

export interface GetPostsBody {
  page: number;
  perPage: number;
}

export interface GetPostsResponse {
  totalCount: number,
  data: PostWithoutAuthorModel[]
}

export interface UpdatePostByIdBody {
  id: number;
  title?: string;
  content?: string;
  imageUrl?: string;
}

export interface DeletePostBody {
  id: number;
}


