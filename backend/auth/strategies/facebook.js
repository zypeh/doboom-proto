'use strict'

import User from '../../models/user'
import { Strategy as FacebookStrategy } from 'passport-facebook'
import { FACEBOOK as opts } from '../config'

export default new FacebookStrategy(opts, async (accessToken, refreshToken, profile, done) => {
    const user = await User.findOne({ 'provider_id.facebook': profile.id }).exec()

    if (user)
        done(null, user)
    else
        done(null, false)
})
