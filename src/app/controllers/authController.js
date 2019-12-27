const User = require('../models/User')
const { JWT, JWK: { asKey } } = require('jose')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const mailer = require('../modules/mailer')

const authConfig = require('./../../config/auth.json')

function generateToken (params = {}) {
  const config = asKey({
    kty: 'oct',
    k: authConfig.secret,
    use: 'sig'
  })

  return JWT.sign(params, config, {
    expiresIn: '1 hour'
  })
}

module.exports = {
  async register (req, res) {
    const { email, username } = req.body

    try {
      if (await User.findOne({ email })) {
        return res.status(400).send({ error: 'User already exists' })
      }

      if (await User.findOne({ username })) {
        return res.status(400).send({ error: 'Username already exists' })
      }

      const user = await User.create(req.body)

      res.send({
        user,
        token: generateToken({ id: user.id })
      })
    } catch (err) {
      res.status(400).send({ error: 'Registration failed' })
    }
  },

  async authenticate (req, res) {
    const { username, password } = req.body

    try {
      const user = await User.findOne({ username }).select('+password')

      if (!user) {
        return res.status(400).send({ error: 'User not found' })
      }

      if (!await bcrypt.compare(password, user.password)) {
        return res.status(400).send({ error: 'Invalid password' })
      }

      user.password = undefined

      res.send({
        user,
        token: generateToken({ id: user.id })
      })
    } catch (err) {
      res.status(400).send({ error: 'Authenticate failed' })
    }
  },

  async forgotPassword (req, res) {
    const { email } = req.body

    try {
      const user = User.findOne({ email })

      if (!user) {
        return res.status(400).send({ error: 'User not found' })
      }

      const token = crypto.randomBytes(20).toString('hex')

      const now = new Date()
      now.setHours(now.getHours() + 1)

      await User.findOneAndUpdate({ email }, {
        passwordResetToken: token,
        passwordResetExpires: now
      })

      mailer.sendMail({
        to: email,
        from: 'phferreirasouza106@gmail.com',
        template: 'auth/forgot_password',
        context: { token }
      }, (err) => {
        if (err) {
          return res.status(400).send({ error: 'Cannot send forgot password email' })
        }

        return res.send()
      })
    } catch (err) {
      res.status(500).send({ error: 'Internal server error' })
    }
  },

  async resetPassword (req, res) {
    const { email, token, password } = req.body

    try {
      const user = await User.findOne({ email }).select('+password')

      if (!user) {
        return res.status(400).send({ error: 'User not found' })
      }

      if (!token) {
        return res.status(400).send({ error: 'Token invalid' })
      }

      const now = new Date()

      if (now > user.passwordResetExpires) {
        return res.status(400).send({ error: 'Token expired, generate a new one' })
      }

      user.password = password
      user.updateAt = now

      await user.save()

      res.send()
    } catch (err) {
      console.log(err)
      return res.status(500).send({ error: 'Internal server error' })
    }
  }
}
