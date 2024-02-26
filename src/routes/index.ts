import { type FastifyInstance } from 'fastify'
import { AuthController } from '../controllers/authController'
import { TokenController } from '../controllers/tokenController'

const authController = new AuthController()
const tokenController = new TokenController()

export async function router (fastify: FastifyInstance) {
  fastify.route({
    method: 'POST',
    url: '/register',
    handler: authController.register
  })
  fastify.route({
    method: 'POST',
    url: '/login',
    handler: authController.login
  })
  fastify.route({
    method: 'GET',
    url: '/logout',
    handler: authController.logout
  })
  fastify.route({
    method: 'POST',
    url: '/generate-access',
    handler: tokenController.generateAccess
  })
}
