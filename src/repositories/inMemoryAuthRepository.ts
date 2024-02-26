import {
  type Credentials,
  type ExistingUsers,
  type NewUser,
  type RegisterUserResponse,
  type RegisterUserResponseError
} from '../use-cases/auth/registerUserUseCase/types'
import { type AuthRepository } from './interfaces/authRepository'
import bcrypt from 'bcrypt'
import { type Secret } from 'jsonwebtoken'
import { type LoginUserResponse, type LoginUserResponseError } from '../use-cases/auth/logUserUseCase/types'
import { type TokenRepository } from './interfaces/tokenRepository'

// Check if the code is running in a testing environment
const isTestingEnvironment = process.env.NODE_ENV === 'test'
const secretKey: Secret | undefined = isTestingEnvironment ? 'testing_secret' : process.env.JWT_SECRET
const refreshExpiresIn: string | number = isTestingEnvironment ? '1m' : process.env.JWT_REFRESH_EXPIRATION_TIME ?? '2m'
const accessExpiresIn: string | number = isTestingEnvironment ? '1m' : process.env.JWT_ACCESS_EXPIRATION_TIME ?? '2m'

export class InMemoryAuthRepository implements AuthRepository {
  public users: ExistingUsers = [{ email: 'a@aa.com', password: '$2b$10$c8RlA86Wpdxcf1hdrs6SZepYlSkT7YAZVLnFmsemahBNfsLjhdT/e', id: 1 }]
  tokenRepository: TokenRepository
  constructor (tokenRepository: TokenRepository) {
    this.tokenRepository = tokenRepository
  }

  async register (user: NewUser): Promise<RegisterUserResponse | RegisterUserResponseError> {
    // Check if the user already exists
    const existingUser = this.users.find(existingUser => existingUser.email === user.email)

    // If exists return promise with conflict error message
    if (existingUser !== undefined) {
      const response: RegisterUserResponseError = {
        data: {
          status: 409,
          message: 'User already exists'
        }
      }
      return await Promise.resolve(response)
    }

    // Otherwise compare passwords
    const hashedPassword = await bcrypt.hash(user.password, 10)

    // Then add user to in-memory DB with hashed password
    this.users.push({ ...user, password: hashedPassword, id: 1 })
    const { password, ...rest } = this.users.slice(-1)[0]

    if (secretKey === undefined) throw new Error('NO SECRET')

    // Finally return promise with created user without password
    const payload = { email: user.email }
    const accessToken = this.tokenRepository.sign(payload, accessExpiresIn)
    const refreshToken = this.tokenRepository.sign(payload, refreshExpiresIn)
    return {
      data: {
        status: 201,
        message: 'User successfully registered',
        user: {
          ...rest
        }
      },
      tokens: {
        accessToken: accessToken ?? '',
        refreshToken: refreshToken ?? ''
      }
    }
  }

  async login (credentials: Credentials): Promise<LoginUserResponse | LoginUserResponseError> {
    // Check if the user exists
    const user = this.users.find(user => user.email === credentials.email)

    // If it doesn't exist return promise with not found error message
    if (user === undefined) {
      return {
        data: {
          status: 404,
          message: 'No user found'
        }
      }
    }

    // Otherwise check if secret key exits and throw error if it doesn't
    if (secretKey === undefined) throw new Error('NO SECRET')

    // If secret key exits compare passwords
    const passwordMatch = await bcrypt.compare(credentials.password, user.password)
    if (!passwordMatch) {
      return {
        data: {
          status: 401,
          message: 'Unauthorized'
        }
      }
    }

    // If it exists return promise with found user with tokens and without password
    const payload = { email: user.email }
    const accessToken = this.tokenRepository.sign(payload, accessExpiresIn)
    const refreshToken = this.tokenRepository.sign(payload, refreshExpiresIn)
    return {
      data: {
        status: 200,
        user: {
          email: user.email,
          id: 1
        }
      },
      tokens: {
        accessToken: accessToken ?? '',
        refreshToken: refreshToken ?? ''
      }
    }
  }

  async logout (): Promise<any> {
    return {
      data: {
        status: 200,
        message: 'User logged out successfully'
      }
    }
  }
}
