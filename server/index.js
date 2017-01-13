import Koa from 'koa'
import Middleware from './middleware'
import Renderer from './renderer'
import Server from './server'
import API from './apis'

const app = new Koa()
const renderer = Renderer(app)

// Wrapping app instance because of the renderer

app
  .use(ctx => ctx.renderer = renderer)
  .use(Server())
  .use(Middleware())
  .use(API())
  .use(ctx => ctx.status = 404)

export default app
