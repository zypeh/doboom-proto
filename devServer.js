import Koa from 'koa'
import colors from 'colors'
import Serve from './backend/server'
import devServer from './build/setup-dev-server'

const app = new Koa()

const port: number = process.env.PORT || 8080

// used to register the bundler into the context
// this will create a new context
const devRenderer = async (ctx, next) => {
  devServer({
    bundleUpdated: (bundle) => { ctx.renderer = createRenderer(bundle) },
    templateUpdated: (template) => { ctx.template = template }
  })
  await next()
}

app.use(devRenderer)
app.use(Serve())

;(async () => {
  await app.listen(port)
  console.log(`[${'#'.yellow}]  DevServer is listening on port ${port}`)
})()
