'use strict'

import Koa from 'koa'
import Middleware from './middleware'
import Renderer from './renderer'
import Routes from './routes'
import Serve from './server'
import Auth from './auth'

const app = new Koa()

app
  .use(ctx => ctx.renderer = renderer) // Setup renderer in context
  .use(Middleware())                   // Contains 3rd parties middlewares
  .use(Auth())                         // Initialize passportjs middleware
  .use(Routes())                       // Contains internal apis
  .use(Serve())                        // Setup SSR (server-side-rendering)
  .use(ctx => ctx.status = 404)        // Return 404 Not Found

export default app
