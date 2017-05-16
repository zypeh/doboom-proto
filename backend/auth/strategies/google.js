'use strict'

import User from '../../models/user'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { GOOGLE as opts } from '../config'

export default new GoogleStrategy(opts, async (accessToken, refreshToken, profile, done) => {
    const user = await User.findOne({ 'provider_id.twitter': profile.id }).exec()

    if (user)
        done(null, user)
    else
        done(null, false)
})
