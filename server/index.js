import Koa from 'koa'
import { compress } from 'koa-compress'

const app = new Koa()

app
  .use(compress({ threshold: 0 }))
  .use(ctx => ctx.body = 'Okay desu~')

;(async () => {
  await app.listen(3000)
})()
