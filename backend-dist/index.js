'use strict';

import Koa from 'koa';
import Middleware from './middleware';
import Renderer from './renderer';
import Routes from './routes';
import Serve from './server';
import Auth from './auth';

var app = new Koa();

app.use(function (ctx) {
  return ctx.renderer = renderer;
}).use(Middleware()).use(Auth()).use(Routes()).use(Serve()).use(function (ctx) {
  return ctx.status = 404;
});

export default app;