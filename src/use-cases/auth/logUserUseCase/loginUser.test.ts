import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryAuthRepository } from '../../../repositories/inMemoryAuthRepository'
import { type AuthRepository } from '../../../repositories/interfaces/authRepository'
import { LoginUserUseCase } from './loginUserUseCase'
import { type TokenRepository } from '../../../repositories/interfaces/tokenRepository'
import { JwtTokenRepository } from '../../../repositories/jwtTokenRepository'

describe('register use case', () => {
  let tokenRepository: TokenRepository
  let authRepository: AuthRepository
  let loginUserUseCase: LoginUserUseCase
  const user = {
    email: 'john.doe@gmail.com',
    password: 'password'
  }
  beforeEach(() => {
    tokenRepository = new JwtTokenRepository()
    authRepository = new InMemoryAuthRepository(tokenRepository)
    loginUserUseCase = new LoginUserUseCase(authRepository)
  })
  it('should login a user if it exists', async () => {
    // ARRANGE
    await authRepository.register(user)

    // ACT
    const res = await loginUserUseCase.execute(user)

    // ASSERT
    if ('data' in res) {
      if ('user' in res.data) {
        expect(res.data.user).toStrictEqual({
          email: 'john.doe@gmail.com',
          id: 1
        })
      }
    }
  })
  it("should not login a user if it doesn't exists", async () => {
    // ARRANGE
    await authRepository.register(user)
    const userToLog = {
      email: 'jane.doe@gmail.com',
      password: 'password'
    }

    // ACT
    const res = await loginUserUseCase.execute(userToLog)

    // ASSERT
    if ('data' in res) {
      if ('status' in res.data) {
        expect(res.data.status).toBe(404)
      }
      if ('message' in res.data) {
        expect(res.data.message).toBe('No user found')
      }
    }
  })
})
