'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

import importDir from 'import-dir';
import composr from 'koa-compose';
import Router from 'koa-router';

var config = [{ folder: 'apiv1', prefix: '/api/v1/' }, { folder: 'base', prefix: '' }];

export default function () {
  var xs = config.reduce(function (prev, curr) {
    var routes = importDir('./' + curr.folder);
    var router = new Router({ prefix: curr.prefix });

    Object.keys(routes).map(function (name) {
      return routes[name](router);
    });
    return [router.routes()].concat(_toConsumableArray(prev));
  }, []);

  return compose(xs);
}