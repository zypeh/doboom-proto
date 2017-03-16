import Koa from 'koa'
import colors from 'colors'
import Serve from './backend/server'
import devServer from './build/setup-dev-server'
import { createRenderer } from './backend/server'

const app = new Koa()

const port: number = process.env.PORT || 8080

let renderer
// used to register the bundler into the context
// this will create a new context
const devRenderer = async (ctx, next) => {
  devServer(app, (bundle, template) => {
    renderer = createRenderer(bundle, template)
  })
  await next()
}

app
  .use(devRenderer)
  .use(ctx => ctx.renderer = renderer) // Setup the renderer
  .use(Serve())
  .use(ctx => ctx.status = 404)

;(async () => {
  await app.listen(port)
  console.log(`[${'#'.yellow}]  DevServer is listening on port ${port}`)
})()
