'use strict'

import Middleware from './middleware'
import Renderer from './renderer'
import Routes from './routes'
import Serve from './server'
import Auth from './auth'
import Koa from 'koa'

const app = new Koa()

let renderer, template
if (process.env.NODE_ENV === 'production') {
  // in production: create server renderer and index HTML from real fs
  renderer = createRenderer(require('../dist/vue-ssr-bundle.json'))
  template = fs.readFileSync(resolve('../dist/index.html'), 'utf-8')
} else {
  devServer({
    bundleUpdated: (bundle) => { renderer = createRenderer(bundle) },
    templateUpdated: (_template) => { template = _template }
  })
}

app
  .use(Middleware())                   // Contains 3rd parties middlewares
  .use(Auth())                         // Initialize passportjs middleware
  .use(Routes())                       // Contains internal apis
  .use(ctx => ctx.renderer = renderer) //
  .use(ctx => ctx.template = template) //
  .use(Serve())                        // Setup SSR (server-side-rendering)
  .use(ctx => ctx.status = 404)        // Return 404 Not Found

export default app
