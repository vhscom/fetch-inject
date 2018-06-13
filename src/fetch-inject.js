import {
  head as injectHead
} from './injectors'

/**
 * Fetch Inject module.
 *
 * @module fetchInject
 * @license BTC
 * @param {(USVString[]|Request[])} inputs Resources you wish to fetch.
 * @param {Promise} [promise] A promise to await before attempting injection.
 * @throws {Promise<TypeError>} Rejects with error on invalid arguments.
 * @throws {Promise<Error>} Whatever `fetch` decides to throw.
 * @throws {SyntaxError} Via DOM upon attempting to parse unexpected tokens.
 * @returns {Promise<Object[]>} A promise which resolves to an `Array` of
 *     Objects containing `Response` `Body` properties used by the module.
 */
const fetchInject = function (inputs, promise) {
  if (!(inputs && Array.isArray(inputs))) return Promise.reject(new TypeError('`inputs` must be an array'))
  if (promise && !(promise instanceof Promise)) return Promise.reject(new TypeError('`promise` must be a promise'))

  const resources = []
  const deferreds = promise ? [].concat(promise) : []
  const thenables = []

  inputs.forEach(input => deferreds.push(
    window.fetch(input).then(res => {
      return [res.clone().text(), res.blob()]
    }).then(promises => {
      return Promise.all(promises).then(resolved => {
        resources.push({ text: resolved[0], blob: resolved[1] })
      })
    })
  ))

  return Promise.all(deferreds).then(() => {
    resources.forEach(resource => {
      thenables.push({ then: resolve => {
        resource.blob.type.includes('text/css')
          ? injectHead(window, document, 'style', resource, resolve)
          : injectHead(window, document, 'script', resource, resolve)
      }})
    })
    return Promise.all(thenables)
  })
}

export default fetchInject
