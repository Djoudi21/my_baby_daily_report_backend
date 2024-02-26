import { beforeEach, describe, expect, it } from 'vitest'
import { RegisterUserUseCase } from './registerUserUseCase'
import { InMemoryAuthRepository } from '../../../repositories/inMemoryAuthRepository'
import { type AuthRepository } from '../../../repositories/interfaces/authRepository'
import type { TokenRepository } from '../../../repositories/interfaces/tokenRepository'
import { JwtTokenRepository } from '../../../repositories/jwtTokenRepository'

describe('register use case', () => {
  let tokenRepository: TokenRepository
  let authRepository: AuthRepository
  let registerUserUseCase: RegisterUserUseCase
  beforeEach(() => {
    tokenRepository = new JwtTokenRepository()
    authRepository = new InMemoryAuthRepository(tokenRepository)
    registerUserUseCase = new RegisterUserUseCase(authRepository)
  })
  it("should register a user if doesn't exists", async () => {
    // ARRANGE
    const newUser = {
      email: 'john.doe@gmail.com',
      password: 'password'
    }

    // ACT
    const createdUser = await registerUserUseCase.execute(newUser)

    // ASSERT
    expect(createdUser.data.status).toBe(201)
    expect(createdUser.data.message).toBe('User successfully registered')
  })
  it('should not register a user if exists', async () => {
    // ARRANGE
    await authRepository.register({
      email: 'john.doe@gmail.com',
      password: 'password'
    })
    const newUser = {
      email: 'john.doe@gmail.com',
      password: 'password'
    }

    // ACT
    const createdUser = await registerUserUseCase.execute(newUser)

    // ASSERT
    expect(createdUser.data.status).toBe(409)
    expect(createdUser.data.message).toBe('User already exists')
  })
})
