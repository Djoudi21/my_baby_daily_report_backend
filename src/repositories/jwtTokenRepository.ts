import { type TokenRepository } from './interfaces/tokenRepository'
import jwt, { type JwtPayload, type Secret } from 'jsonwebtoken'
import {
  type GenerateAccessTokenResponse,
  type GenerateAccessTokenResponseError,
  type SignTokenPayload
} from '../use-cases/token/generateAccessTokenUseCase/types'

const isTestingEnvironment = process.env.NODE_ENV === 'test'
const secretKey: Secret | undefined = isTestingEnvironment ? 'testing_secret' : process.env.JWT_SECRET
const refreshExpiresIn: string | number = isTestingEnvironment ? '1m' : process.env.JWT_REFRESH_EXPIRATION_TIME ?? '2m'

export class JwtTokenRepository implements TokenRepository {
  async regenerateAccessToken (refreshToken: string): Promise<GenerateAccessTokenResponse | GenerateAccessTokenResponseError> {
    if (refreshToken === undefined || secretKey === undefined) {
      return {
        data: {
          status: 401,
          message: 'Unauthorized'
        }
      }
    }

    try {
      jwt.verify(refreshToken, secretKey) as JwtPayload
      const payload = {
        email: 'email'
      }
      const accessToken = this.sign(payload, refreshExpiresIn)
      return {
        data: {
          status: 200,
          tokens: {
            accessToken: accessToken ?? '',
            refreshToken
          }
        }
      }
    } catch (err) {
      return {
        data: {
          status: 403,
          message: 'Forbidden'
        }
      }
    }
  }

  sign (payload: SignTokenPayload, expiresIn: string | number): string | undefined {
    if (secretKey === undefined) return
    return jwt.sign(payload, secretKey, { expiresIn } satisfies jwt.SignOptions)
  }
}
