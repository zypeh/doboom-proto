import webpack from 'webpack'
import base from './webpack.base.config'
import vueConfig from './vue-loader.config'
import htmlPlugin from 'html-webpack-plugin'
import SWPrecachePlugin from 'sw-precache-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'

const config = Object.assign({}, base, {
  resolve: {
    alias: Object.assign({}, base.resolve.alias, {
      'create-api': './create-api-client.js'
    })
  },
  plugins: (base.plugins || []).concat([
    // strip comments in Vue code
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
  // Use ExtractTextPlugin to extract CSS into a single file
  // so it's applied on initial render.
  // vueConfig is already included in the config via LoaderOptionsPlugin
  // here we overwrite the loader config for <style lang="stylus">
  // so they are extracted.
  vueConfig.loaders = {
    stylus: ExtractTextPlugin.extract({
      loader: 'css-loader!stylus-loader',
      fallbackLoader: 'vue-style-loader' // <- this is a dep of vue-loader
    })
  }

  config.plugins.push(
    new ExtractTextPlugin('styles.[hash].css'),

    // this is needed in webpack 2 for minifying CSS
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),

    // minify JS
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),

    new SWPrecachePlugin({
      cacheId: 'swaghouse',
      filename: 'service-worker.js',
      dontCacheBustUrlsMatching: /./,
      staticFileGlobsIgnorePatterns: [/index\.html$/, /\.map$/]
    })
  )
}

export default config
