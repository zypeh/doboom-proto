import webpack from 'webpack'
import base from './webpack.base.config'
import vueConfig from './vue-loader.config'
import htmlPlugin from 'html-webpack-plugin'
import SWPrecachePlugin from 'sw-precache-webpack-plugin'

const config = Object.assign({}, base, {
  resolve: {
    alias: Object.assign({}, base.resolve.alias, {
      'create-api': './create-api-client.js'
    })
  },
  plugins: (base.plugins || []).concat([
    // strip dev only codes in Vue source
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_ENV': '"client"'
    }),

    // extract vendor chunks for better caching
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    }),

    // generate output HTML
    new HTMLPlugin({
      template: 'frontend/index.template.html'
    })
  ])
})

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    // minify JS
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),

    // auto generated service worker
    new SWPrecachePlugin({
      cacheId: 'swaghouse',
      filename: 'service-worker.js',
      dontCacheBustUrlsMatching: /./,
      staticFileGlobsIgnorePatterns: [/index\.html$/, /\.map$/]
    }),

    // banner for entry only
    new webpack.BannerPlugin({
      banner: `Swaghouse product :3`,
      entryOnly: true
    })
  )
}

export default config
