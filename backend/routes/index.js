'use strict'

import importDir from 'import-dir'
import compose from 'koa-compose'
import Router from 'koa-router'

const config: Array<{ folder: string, prefix: string }> = [
  { folder: 'apiv1', prefix: '/api/v1/' },
  //{ folder: 'base', prefix: '' },
]

export default function () {
  const xs: Array<T> = config.reduce((prev, curr) => {
    const routes = importDir('./' + curr.folder)
    const router = new Router({ prefix: curr.prefix })

    Object.keys(routes).map(name => routes[name](router))
    return [router.routes(), ...prev]
  }, [])

  return compose(xs)
}
