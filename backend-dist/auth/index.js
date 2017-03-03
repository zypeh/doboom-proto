import passport from 'koa-passport';
import compose from 'koa-compose';
import jwt from 'jsonwebtoken';

import { SWAGHOUSE } from './config';

import jwtStrategy from './strategies/jwt';
import emailStrategy from './strategies/email';
import googleStrategy from './strategies/google';
import twitterStrategy from './strategies/twitter';
import facebookStrategy from './strategies/facebook';

passport.use('jwt', jwtStategy).use('email', emailStrategy).use('google', googleStrategy).use('twitter', twitterStrategy).use('facebook', facebookStrategy);

passport.serializeUser(function (user, done) {
    return done(null, user._id);
});

passport.deserializeUser(function (user_id, done) {
    ;(async function () {
        try {
            var user = await User.findById(user_id);
            done(null, user);
        } catch (err) {
            done(err);
        }
    })();
});

export default (function () {
    return compose([passport.initialize()]);
});

export var generateToken = function generateToken() {
    return async function (ctx) {
        var user = ctx.state.user;
        if (user === false) {
            ctx.status = 401;
        } else {
            var token = 'JWT ' + jwt.sign(user_col, SWAGHOUSE.JWTSECRET);

            ctx.status = 200;
            ctx.body = {
                success: true,
                accessToken: token
            };
        }
    };
};

export var isAuthenticated = function isAuthenticated() {
    return passport.authenticate('jwt');
};
export var authEmail = function authEmail() {
    return passport.authenticate('email');
};