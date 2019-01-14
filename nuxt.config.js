const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  srcDir: 'src/',
  /*
  ** Headers of the page
  */
  head: {
    htmlAttrs: {
      lang: 'ja'
    },
    title: 'mokumoku-1',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'mokumoku-1' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  transition: {
    name: 'hoge',
    mode: 'out-in'
  },
  css: [
    '@/assets/style.styl'
  ],
  router: {
    base: '/'
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  generate: {
    dir: 'public'
  },
  plugins: ['~/plugins/fetch.ts'],
  build: {
    transpile: [
      /gsap\/*/
    ],
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {
      if (config.resolve.extentions && !config.resolve.extentions.includes('.ts')) {
        config.resolve.extentions.push('.ts')
      }

      config.module.rules.push({
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: { appendTsSuffixTo: [/\.vue$/] }
      })


      if (isClient) {
        if (!config.optimization.minimizer) {
          config.optimization.minimizer = []
        }

        config.optimization.minimizer.push(
          new TerserPlugin({
            terserOptions: {
              compress: {
                drop_console: process.env.NODE_ENV === 'production'
              }
            }
          })
        )
      }
    }
  }
}
