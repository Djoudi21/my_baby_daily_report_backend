import {
  type Credentials,
  type NewUser,
  type RegisterUserResponse,
  type RegisterUserResponseError
} from '../../use-cases/auth/registerUserUseCase/types'
import { type LoginUserResponse, type LoginUserResponseError } from '../../use-cases/auth/logUserUseCase/types'

export interface AuthRepository {
  register: (user: NewUser) => Promise<RegisterUserResponse | RegisterUserResponseError>
  login: (credentials: Credentials) => Promise<LoginUserResponse | LoginUserResponseError>
  logout: () => Promise<any>
}
