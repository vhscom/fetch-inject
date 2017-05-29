import uglify from 'rollup-plugin-uglify'
import license from 'rollup-plugin-license'
import { minify } from 'uglify-es'

const minifier = process.env.MINIFIER
const format = process.env.FORMAT

const config = {
  entry: 'src/fetch-inject.js',
  format: `${format}`,
  moduleName: 'fetchInject',
  sourceMap: false,
  plugins: [
    license({
      banner: `/*! Fetch Inject v<%= pkg.version %> | (c) <%= moment().format('YYYY') %> VHS | @license ISC */`
    })
  ]
}

if (minifier === 'on') {
  config.plugins.unshift(uglify({}, minify))
  config.dest = (format === 'iife')
    ? 'dist/fetch-inject.min.js'
    : `dist/fetch-inject.${format}.min.js`
} else {
  config.dest = (format === 'iife')
    ? 'dist/fetch-inject.js'
    : `dist/fetch-inject.${format}.js`
}

export default config
