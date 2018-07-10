import {
  head as injectHead
} from './injectors'

/**
 * Fetch Inject module.
 *
 * @module fetchInject
 * @license WTFPL
 * @param {(USVString[]|Request[])} inputs Resources you wish to fetch.
 * @param {Promise} [promise] A promise to await before attempting injection.
 * @throws {Promise<TypeError>} Rejects with error on invalid arguments.
 * @throws {Promise<Error>} Whatever `fetch` decides to throw.
 * @throws {SyntaxError} Via DOM upon attempting to parse unexpected tokens.
 * @returns {Promise<Object[]>} A promise which resolves to an `Array` of
 *     Objects containing `Response` `Body` properties used by the module.
 */
const fetchInject = function (inputs, promise) {
  if (!arguments.length) throw new TypeError("Failed to execute 'fetchInject': 1 argument required but only 0 present.")
  ;[...arguments].forEach((arg, idx) => {
    if (idx === 0 && arg.constructor !== Array) throw new TypeError("Failed to execute 'fetchInject': argument 1 must be of type 'Array'.")
    if (idx === 1 && arg.constructor !== Promise) throw new TypeError("Failed to execute 'fetchInject': argument 2 must be of type 'Promise'.")
  })

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
