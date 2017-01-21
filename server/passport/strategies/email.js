import User from '../../model/User'
import { Strategy as CustomStrategy } from 'passport-custom'

export default new CustomStrategy(async (ctx, done) => {
    const request = ctx.request.fields
    if (request.email && request.password) {
        let auth_user
        try {
            /* TODO: User model */
            auth_user = await User.userMatch(email, password)
        } catch (err) {
            ctx.throw(403, `User password not match`)
        }
        /* TODO check user profile completeness */

        // No user found
        if (!auth_user)
            done(null, false)
        
        done(null, auth_user)
    }
})
