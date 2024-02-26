import { AuthRepository } from '../../../repositories/interfaces/authRepository'
import { Credentials } from '../registerUserUseCase/types'
import { LoginUserResponse, LoginUserResponseError } from './types'

export class LoginUserUseCase {
  authRepository: AuthRepository
  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository
  }
  execute(credentials: Credentials):  Promise<LoginUserResponse | LoginUserResponseError> {
    return this.authRepository.login(credentials)
  }
}
