'use strict'

import Middleware from './middleware'
import Routes from './routes'
import Auth from './auth'
import Koa from 'koa'

const app = new Koa()

app
  .use(Middleware())                   // Contains 3rd parties middlewares
  //.use(Auth())                         // Initialize passportjs middleware
  .use(Routes())                       // Contains internal apis
  .use(ctx => ctx.status = 404)        // Return 404 Not Found

export default app
