export const getTokenFromHeaders = (request: { headers: Record<string, any> }) => {
  const authHeader = request.headers.authorization
  return authHeader?.split(' ')[1]
}
