import Fastify from 'fastify'
import cors from '@fastify/cors'
import 'dotenv/config'
import { router } from './routes'

const port = Number(process.env.PORT)
const host = process.env.HOST
const fastify = Fastify({
  logger: true
})

void fastify.register(router)
void fastify.register(cors, {
  // Add any CORS configuration if needed
})

// Run the server!
fastify.listen({ port, host }, function (err, address) {
  if (err !== null) {
    fastify.log.error(err)
  }
  fastify.log.info(`server listening on ${address}`)
})
