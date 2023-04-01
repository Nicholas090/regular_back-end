
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
  content?: string;
  imageUrl: string;
  authorId: number;
}

export interface GetByIdPostBody {
  id: number;
}

export interface GetPostsBody {
  id: number;
  title?: string;
  content?: string;
  imageUrl?: string;
}

export interface UpdatePostByIdBody {
  page: number;
  perPage: number;
}

export interface DeletePostBody {
  id: number;
}


