import User from '../../model/User';
import { Strategy as CustomStrategy } from 'passport-custom';

export default new CustomStrategy(async function (ctx, done) {
    var request = ctx.request.fields;
    if (request.email && request.password) {
        var auth_user = void 0;
        try {
            auth_user = await User.userMatch(email, password);
        } catch (err) {
            ctx.throw(403, 'User password not match');
        }


        if (auth_user) done(null, auth_user);else done(null, false);
    }
});