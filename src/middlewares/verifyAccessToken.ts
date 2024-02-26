import jwt, { type JwtPayload, type Secret } from 'jsonwebtoken'
import { getTokenFromHeaders } from '../utils'

const isTestingEnvironment = process.env.NODE_ENV === 'test'
const secretKey: Secret | undefined = isTestingEnvironment ? 'testing_secret' : (process.env.JWT_SECRET as Secret | undefined)

export const verifyAccessToken = (request: Request, reply: any, done: any): void => {
  const accessToken: string = getTokenFromHeaders(request)
  if (accessToken === undefined) {
    reply.code(401).send({ error: 'Access token not provided' })
    return
  }

  if (secretKey === undefined) {
    return
  }

  try {
    jwt.verify(accessToken, secretKey) as JwtPayload
    done()
  } catch (err) {
    reply.code(403).send({ error: err })
  }
}
