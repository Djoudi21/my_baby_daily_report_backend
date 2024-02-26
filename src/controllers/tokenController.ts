import { JwtTokenRepository } from '../repositories/jwtTokenRepository'
import { GenerateAccessTokenUseCase } from '../use-cases/token/generateAccessTokenUseCase/generateAccessTokenUseCase'

export class TokenController {
  async generateAccess (req: any, reply: any): Promise<void> {
    const { refreshToken }: { refreshToken: string } = req.body.data
    const tokenRepository = new JwtTokenRepository()
    const generateAccessTokenUseCase = new GenerateAccessTokenUseCase(tokenRepository)
    const response = await generateAccessTokenUseCase.execute(refreshToken)
    reply.status(response.data.status).send(response)
  }
}
