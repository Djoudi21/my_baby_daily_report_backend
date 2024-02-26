import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryAuthRepository } from '../../../repositories/inMemoryAuthRepository'
import { type AuthRepository } from '../../../repositories/interfaces/authRepository'
import { LogoutUserUseCase } from './logoutUserUseCase'
import { type TokenRepository } from '../../../repositories/interfaces/tokenRepository'
import { JwtTokenRepository } from '../../../repositories/jwtTokenRepository'

describe('logout use case', () => {
  let tokenRepository: TokenRepository
  let authRepository: AuthRepository
  let logoutUserUseCase: LogoutUserUseCase
  beforeEach(() => {
    tokenRepository = new JwtTokenRepository()
    authRepository = new InMemoryAuthRepository(tokenRepository)
    logoutUserUseCase = new LogoutUserUseCase(authRepository)
  })
  it('should log out a user', async () => {
    // ARRANGE
    await authRepository.logout()

    // ACT
    const response = await logoutUserUseCase.execute()

    // ASSERT
    expect(response.data.status).toBe(200)
  })
})
