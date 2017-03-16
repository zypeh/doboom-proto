import path from 'path'
import webpack from 'webpack'
import memoryfs from 'memory-fs'
import koaWebpack from 'koa-webpack'

// Webpack configuration
import clientConfig from './webpack.client.config'
import serverConfig from './webpack.server.config'

export default (app: Object, callback: Object) => {
  let bundle, template
  // modify client config to work with hot middleware
  clientConfig.entry.app = ['webpack-hot-middleware/client', clientConfig.entry.app]
  clientConfig.output.filename = '[name].js'
  clientConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  )

  const clientCompiler = webpack(clientConfig)

  // webpack dev/hot middleware intergration
  const webpackMiddleware = koaWebpack({
    compiler: clientCompiler,
    dev: {
      publicPath: clientConfig.output.publicPath,
      stats: {
        colors: true,
        chunks: false
      }
    }
  })

  app.use(webpackMiddleware)

  // when it's done, update the index
  clientCompiler.plugin('done', () => {
    const fs = webpackMiddleware.dev.fileSystem
    const filePath = path.join(clientConfig.output.path, 'index.html')
    if (fs.existsSync(filePath)) {
      template = fs.readFileSync(filePath, 'utf-8')
      if (bundle) callback(bundle, template)
    }
  })

  // watcher & update server renderer
  const serverCompiler = webpack(serverConfig)
  const mfs = new memoryfs()

  serverCompiler.outputFileSystem = mfs
  serverCompiler.watch({}, (err, stats) => {
    if (err) throw err
    stats = stats.toJson()
    stats.errors.map(err => console.error(err))
    stats.warnings.map(war => console.warn(war))

    // read bundle generated by vue-ssr-webpack-plugins
    const bundlePath = path.join(serverConfig.output.path, 'vue-ssr-bundle.json')
    bundle = JSON.parse(mfs.readFileSync(bundlePath, 'utf-8'))
    if (template) callback(bundle, template)
  })
}
