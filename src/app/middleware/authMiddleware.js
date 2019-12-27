const { JWT: jwt, JWK } = require('jose')
const authConfig = require('./../../config/auth.json')

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).send({ error: 'No token provided' })
  }

  const parts = authHeader.split(' ')

  if (!parts.length === 2) {
    return res.status(401).send({ error: 'Token error' })
  }

  const [scheme, token] = parts

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).send({ error: 'Token malformatted' })
  }
  const config = JWK.asKey({
    kty: 'oct',
    k: authConfig.secret,
    use: 'sig'
  })

  try {
    const { id } = jwt.verify(token, config)

    req.userId = id

    return next()
  } catch (err) {
    return res.status(401).send({ error: 'Token invalid' })
  }
}
