import uglify from 'rollup-plugin-uglify'
import license from 'rollup-plugin-license'
import { minify } from 'uglify-js-harmony'

const minifier = process.env.MINIFIER || 'off'
const format = process.env.FORMAT || 'iife'

const config = {
  entry: 'src/fetch-inject.js',
  format: `${format}`,
  moduleName: 'fetchInject',
  plugins: [
    license({
      banner: `Fetch Inject\nCopyright (c) <%= moment().format('YYYY') %> VHS\nBuild: <%= moment().format() %>\n@licence MIT`
    })
  ]
}

if (minifier === 'on') {
  config.plugins.unshift(uglify({}, minify))
  config.dest = (format === 'iife')
    ? 'dist/fetch-inject.min.js'
    : `dist/fetch-inject.${format}.min.js`
  config.sourceMap = true
} else {
  config.dest = (format === 'iife')
    ? 'dist/fetch-inject.js'
    : `dist/fetch-inject.${format}.js`
}

export default config
