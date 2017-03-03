'use strict';

import User from '../../models/User';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import { TWITTER as opts } from '../config';

export default new TwitterStrategy(opts, async function (accessToken, refreshToken, profile, done) {
    var user = await User.findOne({ 'provider_id.twitter': profile.id }).exec();

    if (user) done(null, user);else done(null, false);
});