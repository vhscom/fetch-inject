import uglify from 'rollup-plugin-uglify'
import license from 'rollup-plugin-license'
import { minify } from 'uglify-es'

const defaultConfig = {
  entry: 'src/fetch-inject.js',
  plugins: [license({ banner: `/*! Fetch Inject v<%= pkg.version %> | (c) <%= moment().format('YYYY') %> VHS | @license ISC */` })]
}

const activeConfigs = [
  Object.assign({
    format: 'iife',
    moduleName: 'fetchInject',
    dest: 'dist/fetch-inject.js'
  }, defaultConfig),
  Object.assign({
    format: 'es',
    dest: 'dist/fetch-inject.es.js'
  }, defaultConfig),
  Object.assign({
    format: 'umd',
    moduleName: 'fetchInject',
    dest: 'dist/fetch-inject.umd.js'
  }, defaultConfig)
]

const minifiedConfigs = activeConfigs.reduce(
  (minifiedConfigs, activeConfig) => minifiedConfigs.concat(
    Object.assign({}, activeConfig, {
      plugins: activeConfig.plugins.concat([uglify({}, minify)]),
      dest: activeConfig.dest.replace('js', 'min.js')
    })
  ),
  []
)

export default activeConfigs.concat(minifiedConfigs)
