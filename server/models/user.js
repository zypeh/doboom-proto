import uniqueValidator from 'mongoose-unique-validator'
import { genSalt, hash, compare } from 'bcrypt'
import mongoose from 'mongoose-fill'
import shortid from 'shortid'

const UserSchema = new mongoose.Schema({
    _id: { type: String, unique: true, default: shortid.generate },
    email: { type: String, unique: true, required: true },
    username: { type: String, unique: true },
    password: { type: String },
    provider: {
        facebook: { type: Array, default: [] },
        google: { type: Array, default: [] },
        twitter: { type: Array, default: [] },
    },

}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
    },
})
/**
 * preHook, trigger before saving to the database
 */
UserSchema.pre('save', function (next) {
    const user = this
    if (!user.isModified('password')) return next()

    // Hash the password here.
    // FIXME: stronger encryption
    ;(async () => {
        try {
            const salt = await promisified_genSalt()
            const hash = await promisifiedHash(user.password, salt)
            this.password_user = hash
            return next()
        } catch (err) {
            return next(err)
        }
    })()
})

/**
 * un-hash user password
 * @api private
 * @param {String} hash
 * @return {String} text
 */
UserSchema.methods.comparePassword = async function (candidate) {
    return await promisifiedCompare(candidate, this.password_user)
}

/**
 * Find user by email address, and see if the password are matched correctly
 * @param {String} email
 * @param {String} password
 * @return {Object} user_col
 */
UserSchema.statics.userMatch = async function (email, password) {
    const user_col = await this.findOne({ email: email }).exec()

    // User not found
    if (!user_col)
        throw new Error('User not found')

    // User collection has no password field
    if (!user_col.password)
        throw new Error('User signup using 3rd party platform')

    // Matching password
    if (await user_col.comparePassword(password))
        return user_col
    else
        throw new Error('Password does not match')
}

// Email validator
UserSchema.plugin(uniqueValidator, { success: false, message: `Email had been registered` })

export default mongoose.model('User', UserSchema)

const promisifiedCompare = (data, hash) => new Promise((resolve, reject) => {
    compare(data, hash, (err, matched) => {
        if (err)
            return reject(err)
        else
            return resolve(matched)
    })
})

const promisifiedHash = (data, salt) => new Promise((resolve, reject) => {
    hash(data, salt, (err, hash) => {
        if (err)
            return reject(err)
        else
            return resolve(hash)
    })
})

const promisified_genSalt = (rounds, ignore) => new Promise((resolve, reject) => {
    genSalt(rounds, ignore, (err, salt) => {
        if (err)
            return reject(err)
        else
            return resolve(salt)
    })
})
