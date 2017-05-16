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

// User model
import User from '../models/User'

// Register passport method
passport
    .use('jwt', jwtStrategy)
    //.use('email', emailStrategy)
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

// Email authentication
export const authEmail = () => passport.authenticate('email')

// Facebook authentication
export const authFacebook = () => async (ctx, next) => {
  const { code } = ctx.request.fields

  if (typeof code !== 'string')
    ctx.throw(500, `Invalid input 'code', must be a string`)

  const result = await facebookOauth(code)

  let [has_facebook, has_registered] = await Promise.all([
    await User.findOne({ 'provider.facebook.id': result.id }).exec(),
    await User.findOne({ 'email': result.email }).exec()
  ])

  const userCol = await marshalProfile(has_facebook, has_registered, result)

  // For JWT token generation
  ctx.passport = {
    user: userCol._id,
    message: `You have successfully logged in.`
  }

  await next()
}

export const authTwitter = () => async (ctx, next) => {
  const { code } = ctx.request.fields

  if (typeof code !== 'string')
    ctx.throw(500, `Invalid input 'code', must be a string`)

  const result = await twitterOauth(code)

  let [has_twitter, has_registered] = await Promise.all([
    await User.findOne({ 'provider.facebook.id': result.id }).exec(),
    await User.findOne({ 'email': result.email }).exec()
  ])

  const userCol = await marshalProfile(has_twitter, has_registered, result)

  // For JWT token generation
  ctx.passport = {
    user: userCol._id,
    message: `You have successfully logged in.`
  }

  await next()
}

export const authGoogle = () => async (ctx, next) => {
  const { code } = ctx.request.fields

  if (typeof code !== 'string')
    ctx.throw(500, `Invalid input 'code', must be a string`)

  const result = await googleOauth(code)

  let [has_google, has_registered] = await Promise.all([
    await User.findOne({ 'provider.google.id': result.id }).exec(),
    await User.findOne({ 'email': result.email }).exec()
  ])

  const userCol = await marshalProfile(has_twitter, has_registered, result)

  // For JWT token generation
  ctx.passport = {
    user: userCol._id,
    message: `You have successfully logged in.`
  }

}

// Get user profile from Facebook
const facebookOauth = async (code) => {
  const fields = ['id', 'email', 'first_name', 'last_name', 'picture.type(large)']
  const accessTokenURL = `https://graph.facebook.com/oauth/access_token`
  const graphApiURL = `https://graph.facebook.com/v2.5/me?fields=${fields.join(',')}`

  const respCode = await axios.get({
    url: accessTokenURL,
    params: {
      code: code,
      client_id: cliendId,
      redirect_uri: redirectUri
    }
  })

  // The appsecret_proof needed by Facebook
  const hmac = crypto.createHmac('sha256', facebook.APP_secret)
    .update(respCode.access_token)
    .digest('hex')

  const respGraph = await axios.get({
    url: graphApiURL,
    params: {
      access_token: respCode.access_token,
      appsecret_proof: hmac
    }
  })

  return respGraph
}

// Get user profile from Google
const googleOauth = async (code) => {
  const accessTokenURL = `https://accounts.google.com/o/oauth2/token`
  const peopleApiURL = `https://www.googleapis.com/plus/v1/people/me/openIdConnect`

  const respCode = await axios.post({
    url: accessTokenURL,
    data: {
      code: code,
      client_id: clientId,
      client_secret: '',
      redirect_uri: '',
      grant_type: 'authorization_code'
    }
  })

  const result = await axios.post({
    url: peopleApiURL,
    headers: {
      Authorization: `Bearer ${respCode.access_token}`
    }
  })

  // simple hack; request google for a bigger size profile pic
  result.picture = result.picture.replace(/sz=50/i, 'sz=200')
  return result
}

// Get user profile from Twitter
const twitterOauth = async (code) => {
  const accessTokenURL = `https://api.twitter.com/oauth2/token`
  const accountApiURL = `https://api.twitter.com/1.1/account/verify_credentials.json`

  // Base64 encoded credentials
  const credential = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64')

  const respCode = await axios.post({
    url: accessTokenURL,
    headers: `Basic ${credential}`
  })

  const result = await axios.get({
    url: accountApiURL,
    // When set to true email will be returned in the user objects as a string.
    // If the user does not have an email address on their account, or not verified,
    // null will be returned.
    params: {
      include_email: true
    },
    headers: {
      Authorization: `Bearer ${respCode.access_token}`
    }
  })

  return result
}

// Marshal profile.
const marshalProfile = async (has_linked: Object, has_registered: Object, profile: Object): Object => {

  let userCol

  // If user has been registered an account in our platform,
  // and has been linked his facebook account.
  if (has_linked && has_registered) {
    if (!has_linked.custom_avatar) {
      has_linked.avatar = profile.picture.data.url
      has_linked = await has_linked.save()
    }
    userCol = has_linked
  }

  // If user has been registered an account in our platform, but
  // haven't link his facebook account
  if (!has_linked && has_registered) {
    has_registered.provider.facebook = result

    if (!has_registered.custom_avatar)
      has_registered.avatar = profile.picture.data.url

    has_registered = await has_registered.save()
    userCol = has_registered
  }

  // If user didn't registered an account in our platform
  if (!has_registered)
    userCol = await SignupUser('facebook', profile)

  return userCol
}
