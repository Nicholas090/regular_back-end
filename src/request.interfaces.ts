
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


