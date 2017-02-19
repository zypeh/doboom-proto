import passport from 'koa-passport'
import compose from 'koa-compose'
import jwt from 'jsonwebtoken'

import { SWAGHOUSE } from './config'

// Strategies
import jwtStrategy from './strategies/jwt'
import emailStrategy from './strategies/email'
import googleStrategy from './strategies/google'
import twitterStrategy from './strategies/twitter'
import facebookStrategy from './strategies/facebook'

// Register passport method
passport
    .use('jwt', jwtStategy)
    .use('email', emailStrategy)
    .use('google', googleStrategy)
    .use('twitter', twitterStrategy)
    .use('facebook', facebookStrategy)

// Serialize user, to get user.
passport.serializeUser((user, done) => done(null, user._id))
// Deserialize user, to get user collection by using user._id
passport.deserializeUser((user_id, done) => {
    ;(async () => {
        try {
            const user = await User.findById(user_id)
            done(null, user)
        } catch (err) { done(err) }
    })()
})

export default () => compose([ passport.initialize() ])

export const generateToken = () => async ctx => {
    const user = ctx.state.user
    if (user === false) {
        // Unauthorized
        ctx.status = 401
    } else {
        const token = `JWT ${jwt.sign(user_col, SWAGHOUSE.JWTSECRET)}`
        // OK
        ctx.status = 200
        ctx.body = {
            success: true,
            accessToken: token,
        }
    }
}

// JWT authentication
export const isAuthenticated = () => passport.authenticate('jwt')
export const authEmail = () => passport.authenticate('email')