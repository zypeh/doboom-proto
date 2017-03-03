import User from '../../models/User';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import { auth } from '../config';

var opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeader(),
  secretOrKey: auth.secret
};

export default new JWTStrategy(opts, async function (jwt_payload, done) {
  var user = await User.findById(jwt_payload.id).exec();
  if (user) {
    done(null, user);
  } else {
    done(null, false);
  }
});