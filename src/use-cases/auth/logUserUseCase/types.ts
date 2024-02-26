export interface User {
  email: string;
  id: number;
}

export interface LoginUserResponse {
  data: {
    user: User;
    status: 200;
  }
  tokens: {
    accessToken: string,
    refreshToken: string
  }
}

export interface LoginUserResponseError {
  data: {
    message: string;
    status: 401 | 404;
  }
}
