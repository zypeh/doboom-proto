import path from 'path'
import webpack from 'webpack'
import memoryfs from 'memory-fs'
import { devMiddleware, hotMiddleware } from 'koa-webpack-middleware'

import { clientConfig } from './webpack.client.config'
import { serverConfig } from './webpack.server.config'


export default function(app: object, opts: object) {
  // modify client config to work with hot middleware
  clientConfig.entry.app = ['webpack-hot-middleware/client', clientConfig.entry.app]
  clientConfig.output.filename = '[name].js'
  clientConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  )

  // devMiddleware
  const clientCompiler = webpack(clientConfig)
  app.use(devMiddleware(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
    stats: {
      colors: true,
      chunks: false
    }
  }))

  // when it's done, update the index
  clientCompiler.plugin('done', () => {
    const fs = devMiddleware.fileSystem
    const filePath = path.join(clientConfig.output.path, 'index.html')
    if (fs.existsSync(filePath)) {
      const index = fs.readFileSync(filePath, 'utf-8')
      opts.indexUpdated(index)
    }
  })

  // hot middleware
  app.use(hotMiddleware(clientCompiler))

  // watcher & update server renderer
  const serverCompiler = webpack(serverConfig)
  const mfs = new memoryfs()
  const outputPath = path.join(serverConfig.output.path, serverConfig.output.filename)
  
  serverCompiler.outputFileSystem = mfs
  serverCompiler.watch({}, (err, stats) => {
    if (err) throw err
    stats = stats.toJson()
    stats.errors.map(err => console.error(err))
    stats.warnings.map(war = console.warn(war))
    opts.bundleUpdated(mfs.readFileSync(outputPath, 'utf-8'))
  })
}