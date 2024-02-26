import {  NewUser } from './types'
import { AuthRepository } from '../../../repositories/interfaces/authRepository'


export class RegisterUserUseCase {
  authRepository: AuthRepository
  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository
  }
  execute(user: NewUser) {
    return this.authRepository.register(user)
  }
}
