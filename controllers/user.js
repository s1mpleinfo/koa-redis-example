const router = require('koa-router')()
const db = require('../config/mongo')
const UUID = require('uuid-js')
const bcrypt = require('bcryptjs')
const _ = require('lodash')

const saltRounds = 10

/**
 * Create User, Contain username, userId, email,
 * salt generate by bcrypt & password encrypted
 * todo: front-end encrypt plainPassword
 */
const createUser = async (ctx) => {
  const plainUser = ctx.request.body
  const userId = UUID.create().toString()
  const salt = bcrypt.genSaltSync(saltRounds)
  const hashPassword = bcrypt.hashSync(plainUser.plainPassword, salt)
  console.log('salt', salt)
  console.log('hashPassword', hashPassword)
  const user = _.omit({
    ...plainUser,
    userId,
    password: hashPassword,
    salt
  }, 'plainPassword')
  db.user.save(user)
  ctx.body = user
}

router.post('/user/create', createUser)

module.exports = router