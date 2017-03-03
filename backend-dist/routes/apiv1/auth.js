'use strict';

import { authEmail, authGoogle, authTwitter, authFacebook, generateToken, authGoogle_callback, authTwitter_callback, authFacebook_callback } from '../../auth';
import User from '../../models/User';

export default (function (router) {
    return router.post('/auth/register', register, generateToken()).get('/auth/refresh', isAuthenticated(), generateToken()).post('/auth/email', authEmail(), generateToken()).get('/auth/facebook', authFacebook()).get('/auth/facebook/callback', authFacebook_callback(), generateToken()).get('/auth/twitter', authTwitter()).get('/auth/twitter/callback', authTwitter_callback(), generateToken()).get('/auth/google', authGoogle()).get('/auth/google/callback', authGoogle_callback(), generateToken());
});

var register = async function register(ctx, next) {
    var _ctx$request$body = ctx.request.body,
        username = _ctx$request$body.username,
        email = _ctx$request$body.email,
        password = _ctx$request$body.password;


    ctx.passport = { user: user._id };
    await next();
};