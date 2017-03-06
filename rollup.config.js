import path from 'path'
import uglify from 'rollup-plugin-uglify'
import license from 'rollup-plugin-license'

export default {
  entry: 'src/fetch-inject.js',
  format: 'iife',
  moduleName: 'fetchInject',
  plugins: [
    uglify(),
    license({
      banner: {
        file: path.join(__dirname, 'LICENSE')
      }
    })
  ],
  dest: 'dist/fetch-inject.js'
}
