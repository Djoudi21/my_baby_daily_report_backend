import { type AuthRepository } from '../../../repositories/interfaces/authRepository'

export class LogoutUserUseCase {
  authRepository: AuthRepository
  constructor (authRepository: AuthRepository) {
    this.authRepository = authRepository
  }

  async execute (): Promise<any> {
    return await this.authRepository.logout()
  }
}
