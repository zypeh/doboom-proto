import autoprefixer from 'autoprefixer'

export default {
  preserveWhitespace: false,
  postcss: [
    autoprefixer({
      browsers: ['last 3 versions']
    })
  ]
}
