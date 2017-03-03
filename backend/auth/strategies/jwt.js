'use strict'

import User from '../../models/User'
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt'
import { SWAGHOUSE as auth } from '../config'

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeader(),
  secretOrKey: auth.JWTSECRET,
}

export default new JWTStrategy(opts, async (jwt_payload, done) => {
  const user = await User.findById(jwt_payload.id).exec()
  if (user) {
    done(null, user)
  } else {
    done(null, false)
  }
})
