'use static'

import fs from 'fs'
import path from 'path'
import Route from 'koa-router'
import Serve from 'koa-static'
import compress from 'koa-compress'
import HTMLStream from 'vue-ssr-html-stream'

const isProd = process.env.NODE_ENV === 'production'

export default () => conpose([
    // compression
    compression({ threshold: 0 }),

    // favicon
    favicon('../../public/favicon.png')

    // distribution file
    serve('../../dist'),

    // public path expose
    serve('../../public'),

    // manifest for PWA
    serve('../../manifest.json'),

    // service worker
    serve('../../dist/service-worker.js'),

    // warmup renderer
    Route.get('*', server),

])

const resolve = (file: String) => path.resolve(__dirname, file)

const serve = (path: String, cache) => Serve(resolve(path), {
    maxAge: (cache && isProd)
            ? 60 * 60 * 24 * 30
            : 0
})

async function server(ctx, next) {
    if (!renderer) {
        ctx.status = 200
        ctx.body = `Wait for a while... refresh in a moment.`
    }

    const s = Date.now()

    // Header
    ctx.set('Content-Type', 'text/html')

    const context = { url: ctx.url }
    const htmlStream = new htmlStream({ template, context })

    ctx.body = renderer.renderToStream(context)
        .on('error', () => ctx.throw(500, `Error occurred during rendering on ${context.url}`))
        .pipe(htmlStream)
        .on('end', () => console.log(`Whole request taken: ${Date.now() - s}ms`))
}