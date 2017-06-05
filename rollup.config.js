import uglify from 'rollup-plugin-uglify'
import license from 'rollup-plugin-license'
import { minify } from 'uglify-es'

const defaultConfig = {
  entry: 'src/fetch-inject.js',
  plugins: []
}

const activeConfigs = [{
  format: 'iife',
  moduleName: 'fetchInject',
  dest: 'dist/fetch-inject.js'
}, {
  format: 'es',
  dest: 'dist/fetch-inject.es.js'
}, {
  format: 'umd',
  moduleName: 'fetchInject',
  dest: 'dist/fetch-inject.umd.js'
}]

activeConfigs.forEach(activeConfig => {
  Object.assign(activeConfig, defaultConfig)
})

const minifiedConfigs = activeConfigs.reduce(
  (minifiedConfigs, activeConfig) => minifiedConfigs.concat(
    Object.assign({}, activeConfig, {
      plugins: [
        uglify({}, minify),
        license({ banner: `/*! Fetch Inject v<%= pkg.version %> | (c) <%= moment().format('YYYY') %> VHS | @license ISC */` }),
        ...activeConfig.plugins
      ],
      dest: activeConfig.dest.replace('js', 'min.js')
    })
  ),
  []
)

export default activeConfigs.concat(minifiedConfigs)
