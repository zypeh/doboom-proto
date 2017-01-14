'use strict'

import bodyParser from 'koa-better-body'
import compress from 'koa-compress'
import compose from 'koa-compose'
import convert from 'koa-convert'

export default function(app: object) {
  return compose([
    // fancy candy
    swagness,

    // error handling
    errhandler,

    // compress
    compress({ threshold: 0 }),

    // body parser
    convert(bodyParser()),

  ])
}

async function swagness(ctx, next) {
  ctx.set('X-Powered-By', 'something swag')
  await next()
}

async function errhandler(ctx, next) {
  try {
    await next()
  } catch (err) {
    ctx.status = err.status || 500
    ctx.body = {
      success: false,
      message: err.message || 'Internal Error'
    }

    if (ctx.status === 500)
      ctx.app.emit('error', err, ctx)

  }
}
