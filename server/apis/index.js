'use strict'

import importDir from 'import-dir'
import composr from 'koa-compose'
import Router from 'koa-router'

const config: Array<{ folder: string, prefix: string }> = [
  { folder: 'passport', prefix: '/v1/api' },
  { folder: 'chat', prefix: '/v1/api' },
  { folder: 'newsfeed', prefix: '/v1/api' },
]

export default function () {
  const c = config.reduce((prev, curr) => {
    const routes = importDir('./' + curr.folder)
    const router = new Router({ prefix. curr.prefix })

    Object.keys(routes).map(name => routes[name](router))
    return [router.routes(), ...prev]
  }, [])

  return compose(c)
}
