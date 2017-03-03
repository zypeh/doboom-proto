'use strict';

import User from '../../models/User';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { facebook as opts } from '../config';

export default new FacebookStrategy(opts, async function (accessToken, refreshToken, profile, done) {
    var user = await User.findOne({ 'provider_id.facebook': profile.id }).exec();

    if (user) done(null, user);else done(null, false);
});