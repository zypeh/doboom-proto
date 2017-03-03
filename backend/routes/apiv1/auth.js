'use strict'

import {
    authEmail,
    authGoogle,
    authTwitter,
    authFacebook,
    generateToken,

    authGoogle_callback,
    authTwitter_callback,
    authFacebook_callback,
} from '../../auth'
import User from '../../models/User'

export default (router) => router
    // register via email
    .post(
        '/auth/register',
        register,
        generateToken(),
    )

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
    .get(
        '/auth/facebook',
        authFacebook(),
    )
    // Facebook callback, returning JWT token
    .get(
        '/auth/facebook/callback',
        authFacebook_callback(),
        generateToken(),
    )

    // Authenticate via twitter
    .get(
        '/auth/twitter',
        authTwitter(),
    )
    // Twitter callback, returning JWT token
    .get(
        '/auth/twitter/callback',
        authTwitter_callback(),
        generateToken(),
    )

    // Authenticate via google
    .get(
        '/auth/google',
        authGoogle(),
    )
    // Google callback, returning JWT token
    .get(
        '/auth/google/callback',
        authGoogle_callback(),
        generateToken(),
    )

const register = async (ctx, next) => {
    const { username, email, password } = ctx.request.body

    ctx.passport = { user: user._id }
    await next()
}