import webpack from 'webpack'
import base from './webpack.base.config'
import VueSSRPlugin from 'vue-ssr-webpack-plugin'

const config = Object.assign({}, base, {
  target: 'node',
  entry: './frontend/entry-server.js'
  output: Object.assign({}, base.output, {
    filename: 'server-bundle.js',
    libraryTarget: 'commonjs2'
  }),
  resolve: {
    alias: Object.assign({}, base.resolve.alias, {
      'create-api': './create-api-server.js'
    })
  },
  externals: Object.keys(require('../package.json').dependencies),
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_ENV': '"server"'
    }),
    new VueSSRPlugin()
  ]
})

export default config
