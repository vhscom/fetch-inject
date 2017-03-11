import uglify from 'rollup-plugin-uglify'
import license from 'rollup-plugin-license'
import { minify } from 'uglify-js-harmony'

const config = {
  entry: 'src/fetch-inject.js',
  format: 'iife',
  moduleName: 'fetchInject',
  plugins: [
    license({
      banner: `Copyright (c) <%= moment().format('YYYY') %> VHS\n@licence MIT`
    })
  ]
}

if (process.env.BUILD_TARGET === 'minified') {
  config.plugins.unshift(uglify({}, minify))
  config.dest = 'dist/fetch-inject.min.js'
  config.sourceMap = true
} else {
  config.dest = 'dist/fetch-inject.js'
}

export default config
