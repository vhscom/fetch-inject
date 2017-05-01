import {
  head as injectHead
} from './injectors'

/**
 * Fetch Inject module.
 * @module fetchInject
 * @param {(USVString[]|Request[])} inputs Resources you wish to fetch.
 * @param {Promise} [promise] A promise to await before attempting injection.
 * @exception {Promise<Error>} Invalid arguments and anything Fetch throws.
 * @returns {Promise<Array<Object>>} Promise that resolves to an Array of
 *     Objects containing Response Body properties used by the Module.
 */
const fetchInject = function (inputs, promise) {
  if (!(inputs && Array.isArray(inputs))) return Promise.reject(new Error('`inputs` must be an array'))
  if (promise && !(promise instanceof Promise)) return Promise.reject(new Error('`promise` must be a promise'))

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
        resource.blob.type.split(';')[0] === 'text/css'
          ? injectHead(window, document, 'style', resource, resolve)
          : injectHead(window, document, 'script', resource, resolve)
      }})
    })
    return Promise.all(thenables)
  })
}

export default fetchInject
