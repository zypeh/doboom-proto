import passport from 'koa-passport'
import * as config from './config'
import compose fro 'koa-compose'
import jwt from 'jsonwebtoken'

// Strategies
import jwtStategy from './strategies/jwt'
import emailStrategy from './strategies/email'

// Register passport method
passport
    .use('jwt', jwtStategy)
    .use('email', emailStrategy)

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
    const { user } = ctx.passport
    if (user === false) {
        // Unauthorized
        ctx.status = 401
    } else {
        const token = `JWT ${jwt.sign(user_col, config.secret)}`
        ctx.status = 200
        ctx.body = {
            success: true,
            accessToken: token,
        }
    }
}

// JWT authentication
export const isAuthenticated = () => pasport.authenticate('jwt')

// email authentication
export const emailAuthentication = () => passport.authenticate('email')

// facebook authentication
export const facebookAuthentication = () => passport.authenticate('facebook', {
    scope: ['email'],
})
export const facebookAuthenticationCallback = () => passport.authenticate('facebook', {
    failureRedirect: '/',
})

// twitter authentication
export const twitterAuthentication = () => passport.authenticate('twitter', {
    scope: ['email'],
})
export const twitterAuthenticationCallback = () => passport.authenticate('twitter', {
    failureRedirect: '/',
})

// Google authentication
export const googleAuthentication = () => passport.authenticate('google', {
    scope: ['email'],
})
export const googleAuthenticationCallback = () => passport.authenticate('google', {
    failureRedirect: '/',
})