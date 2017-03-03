# 这是怎样运作的？

简单的一句话，我们使用 isomorphic app 的方式来部署我们的前端，后端也需要因为我们需要 isomorphic 同态应用而设计成可以经由我们的后端来渲染我们需要的页面。这就是我们用的技术了。

## 后端
后端我们使用的是 Koa, 然后很前卫地用了 `Node v7.6` 才开始启用的 `async/await` 支持。（可以从我们的 `.babelrc` 看到我开启了相关的 plugin `syntax-async-functions`，跳过了对 `async/await` 的转换。）

我们用 `connect` 写法。每个 API 分门别归类到不同的文件夹下。其中很大部分的业务应用都在 `routes` 下。我的 `routes/index.js` 会把文件夹下的文件加载，而且加了 URL。

其他的我也都是以 `middleware` (中间件) 的方式一一加载。看看 `backend/middleware` 就知道了。

```js
import ... from ...

export default () => compose([
    // logger
    logger(),

    // fancy candy
    swagness,

    // error handling
    errhandler,

    // body parser
    convert(bodyParser()),

    // Cross-Origin Resource Sharing
    cors(),
])

async function swagness(ctx, next) {
  ctx.set('X-Powered-By', 'something swag')
  await next()
}
```

来看看我们的 `routes` 下的文件是怎么写的。举个例子： `routes/apiv1/auth.js`

```js
export default (router) => router
    // register via email
    .post(
        '/auth/register',
        register,
        generateToken(),
    )

const register = async (ctx, next) => {
    const { username, email, password } = ctx.request.body

    ctx.passport = { user: user._id }
    await next()
}
```

我会在文件头 `export 一个函数` 返回的是 `router` 中间数据。而这个中间数据我们定义了一系列的函数链。例如里面的 `.post()` 就是我们先匹配 `/auth/register` 这个 URL 然后执行 `register` 函数。最后我们在 `register` 函数返回 `await next()` 来返回下一个异步函数，也就是 `generateToken()`。

而函数需要参数，我们 `generateToken()` 的参数就是 `ctx`（通 context）, 还有 next （我们的 `callback` 体)。我们的函数链上下传递的就只有 `ctx` 这个参数，也就是一个大大的 Object。而函数其实就是在中间修改数据，然后通过传递 callback 传到下个函数，下个函数从 context 读取要的数据，做任何动作。

就这样简单。

## 前端
如果说后端是基于设计模式和 callback 的原理的话；那么前端就是牵涉到工具的使用还有部署策略了。

怎么说？

我们前端用的是 `Vue`。我们使用了状态器 `Vuex`，还有 `Webpack2` 做预处理。最后的情况就是我们分离成两个模块，一个就是抽离了很多页面的，只有保留几个预先渲染的页面交给用户，或是爬虫。另一个就是给我们的后端内置的 `bundle renderer` 来渲染我们的页面，然后开 `stream` 传到前端。

![](https://cloud.githubusercontent.com/assets/499550/17607895/786a415a-5fee-11e6-9c11-45a2cfdf085c.png)

这下就很尴尬了，因为我们的前端需要写到组件化，这样就可以最大的重用我们的组件。

详细还没完成。有问题能够先问我。
