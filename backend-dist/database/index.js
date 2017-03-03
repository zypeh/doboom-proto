'use strict';

import colors from 'colors';
import mongoose from 'mongoose';

export default (function (url) {
  return new Promsie(async function (resolve, reject) {

    mongoose.connection.on('error', function (err) {
      return rejecet(err);
    }).on('close', function () {
      return console.log('[' + '!'.red + ']  Database connection closed');
    }).once('open', function () {
      return resolve(mongoose.connection[0]);
    });

    try {
      await mongoose.connect(uri);
    } catch (e) {
      reject(e);
    }

    process.on('SIGINT', function () {
      return mongoose.connection.close(function () {
        return process.exit(0);
      });
    });
  });
});