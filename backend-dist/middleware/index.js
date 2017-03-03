'use strict';

import bodyParser from 'koa-better-body';
import compose from 'koa-compose';
import convert from 'koa-convert';
import logger from 'koa-logger';
import cors from 'kcors';

export default (function () {
  return compose([logger(), swagness, errhandler, convert(bodyParser()), cors()]);
});

async function swagness(ctx, next) {
  ctx.set('X-Powered-By', 'something swag');
  await next();
}

async function errhandler(ctx, next) {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = {
      success: false,
      message: err.message || 'Internal Error'
    };

    if (ctx.status === 500) ctx.app.emit('error', err, ctx);
  }
}