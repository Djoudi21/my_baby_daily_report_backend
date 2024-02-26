import { User } from '../logUserUseCase/types'

export type NewUser = {
  email: string,
  password: string
}

export type Credentials = {
  email: string,
  password: string
}

export type ExistingUser = NewUser & {id: number}

export type ExistingUsers = ExistingUser[]

export interface RegisterUserResponse {
  data: {
    user: User;
    message: string,
    status: 201;
  }
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface RegisterUserResponseError {
  data: {
    message: string;
    status: 409;
  }
}
