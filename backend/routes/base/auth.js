'use strict'

import {
    authEmail,
    authGoogle,
    authTwitter,
    authFacebook,
    generateToken,
    isAuthenticated,
} from '../../auth'
import User from '../../models/User'

export default (router) => router
  // register via email
  //.post(
  //  '/auth/register',
  //  register,
  //  generateToken(),
  //)

  // renew JWT token
  .get(
    '/auth/refresh',
    isAuthenticated(),
    generateToken(),
  )

  // Authenticate via email
  .post(
    '/auth/email',
    authEmail(),
    generateToken(),
  )

  // Authenticate via facebook
  .post(
    '/auth/facebook',
    authFacebook(),
    generateToken(),
  )

  //Authenticate via twitter
  .post(
    '/auth/twitter',
    authTwitter(),
    generateToken(),
  )

  // Authenticate via google
  .post(
    '/auth/google',
    authGoogle(),
    generateToken(),
  )

//const register = async (ctx, next) => { }
