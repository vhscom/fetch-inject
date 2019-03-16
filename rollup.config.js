import uglify from 'rollup-plugin-uglify'
import license from 'rollup-plugin-license'
import { minify } from 'uglify-es'

const defaultConfig = {
  input: 'src/fetch-inject.js',
  plugins: []
}

const activeConfigs = [{
  output: {
    format: 'iife',
    name: 'fetchInject',
    file: 'dist/fetch-inject.js'
  }
}, {
  output: {
    format: 'es',
    file: 'dist/fetch-inject.es.js'
  }
}, {
  output: {
    format: 'umd',
    name: 'fetchInject',
    file: 'dist/fetch-inject.umd.js'
  }
}]

activeConfigs.forEach(activeConfig => {
  Object.assign(activeConfig, defaultConfig)
})

const minifiedConfigs = activeConfigs.reduce(
  (minifiedConfigs, activeConfig) => minifiedConfigs.concat(
    Object.assign({}, activeConfig, {
      plugins: [
        uglify({}, minify),
        license({ banner: `/*! Fetch Inject v<%= pkg.version %> | Copyright (C) VHS <vhsdev@tutanota.com> (https://vhs.codeberg.page) | @license Zlib */` }),
        ...activeConfig.plugins
      ],
      output: {
        ...activeConfig.output,
        file: activeConfig.output.file.replace('js', 'min.js')
      }
    })
  ),
  []
)

export default activeConfigs.concat(minifiedConfigs)
