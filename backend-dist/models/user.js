'use strict';

import uniqueValidator from 'mongoose-unique-validator';
import { genSalt, hash, compare } from 'bcrypt';
import mongoose from 'mongoose-fill';
import shortid from 'shortid';

var UserSchema = new mongoose.Schema({
    _id: { type: String, unique: true, required: true, default: shortid.generate },
    email: { type: String, unique: true, required: true },
    username: { type: String, unique: true },
    password: { type: String },

    provider_id: {
        facebook: { type: String, default: null },
        google: { type: String, default: null },
        twitter: { type: String, default: null }
    },

    provider: {
        facebook: { type: Object, default: null },
        google: { type: Object, default: null },
        twitter: { type: Object, default: null }
    }

}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
});

UserSchema.pre('save', function (next) {
    var _this = this;

    var user = this;
    if (!user.isModified('password')) return next();(async function () {
        try {
            var salt = await promisified_genSalt();
            var _hash = await promisifiedHash(user.password, salt);
            _this.password_user = _hash;
            return next();
        } catch (err) {
            return next(err);
        }
    })();
});

UserSchema.methods.comparePassword = async function (candidate) {
    return await promisifiedCompare(candidate, this.password_user);
};

UserSchema.statics.userMatch = async function (email, password) {
    var user_col = await this.findOne({ email: email }).exec();

    if (!user_col) throw new Error('User not found');

    if (!user_col.password) throw new Error('User signup using 3rd party platform');

    if (await user_col.comparePassword(password)) return user_col;else throw new Error('Password does not match');
};

UserSchema.plugin(uniqueValidator, { success: false, message: 'Email had been registered' });

export default mongoose.model('User', UserSchema);

var promisifiedCompare = function promisifiedCompare(data, hash) {
    return new Promise(function (resolve, reject) {
        compare(data, hash, function (err, matched) {
            if (err) return reject(err);else return resolve(matched);
        });
    });
};

var promisifiedHash = function promisifiedHash(data, salt) {
    return new Promise(function (resolve, reject) {
        hash(data, salt, function (err, hash) {
            if (err) return reject(err);else return resolve(hash);
        });
    });
};

var promisified_genSalt = function promisified_genSalt(rounds, ignore) {
    return new Promise(function (resolve, reject) {
        genSalt(rounds, ignore, function (err, salt) {
            if (err) return reject(err);else return resolve(salt);
        });
    });
};