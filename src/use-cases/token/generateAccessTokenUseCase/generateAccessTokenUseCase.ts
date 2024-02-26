import { type TokenRepository } from '../../../repositories/interfaces/tokenRepository'
import { type GenerateAccessTokenResponse, type GenerateAccessTokenResponseError } from './types'

export class GenerateAccessTokenUseCase {
  tokenRepository: TokenRepository
  constructor (tokenRepository: TokenRepository) {
    this.tokenRepository = tokenRepository
  }

  async execute (refreshToken: string): Promise<GenerateAccessTokenResponse | GenerateAccessTokenResponseError> {
    return await this.tokenRepository.regenerateAccessToken(refreshToken)
  }
}
