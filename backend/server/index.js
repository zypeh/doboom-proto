'use static'

import fs from 'fs'
import path from 'path'
import LRU from 'lru-cache'
import Route from 'koa-router'
import Serve from 'koa-static'
import compose from 'koa-compose'
import favicon from 'koa-favicon'
import compress from 'koa-compress'
import { createBundleRenderer } from 'vue-server-renderer'

const isProd = process.env.NODE_ENV === 'production'
const Router = new Route()

export default () => compose([
  // compression
  compress({ threshold: 0 }),

  // favicon
  favicon('../../public/favicon.png'),

  // distribution file
  serve('../../dist'),

  // public path expose
  serve('../../public'),

  // manifest for PWA
  serve('../../manifest.json'),

  // service worker
  serve('../../dist/service-worker.js'),

  // warmup renderer
  Router.routes(),
  Router.allowedMethods(),
])

Router.get('*', server)

const resolve = (file: string) => path.resolve(__dirname, file)

const serve = (path: string, cache) => Serve(resolve(path), {
  maxAge: (cache && isProd)
        ? 60 * 60 * 24 * 30
        : 0
})

async function server(ctx) {

  if (!ctx.renderer) {
    ctx.status = 200
    ctx.body = `Wait for a while... refresh in a moment.`
  }

  const s = Date.now()

  // Header
  ctx.set('Content-Type', 'text/html')

  const context = { url: ctx.originalUrl }

  ctx.renderer.renderToStream(context)
    .on('error', () => ctx.throw(500, `Error occurred during rendering on ${context.url}`))
    .on('end', () => console.log(`Whole request taken: ${Date.now() - s}ms`))
    .pipe(ctx.body)
}

export const createRenderer = (bundle: string, template: string) => {
  return createBundleRenderer(bundle, {
    template,
    cache: LRU({
      max: 1000,
      maxAge: 1000 * 60 * 15
    })
  })
}
