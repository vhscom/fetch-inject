import {
  head as injectHead
} from './injectors'

const fetchInject = function (urls, promise) {
  if (!(urls && Array.isArray(urls))) return Promise.reject(new Error('`urls` must be an array'))
  if (promise && !(promise instanceof Promise)) return Promise.reject(new Error('`promise` must be a promise'))

  const resources = []
  const deferreds = promise ? [].concat(promise) : []
  const thenables = []

  urls.forEach(url => deferreds.push(
    window.fetch(url).then(res => {
      return [res.clone().text(), res.blob()]
    }).then(promises => {
      return Promise.all(promises).then(resolved => {
        resources.push({ text: resolved[0], type: resolved[1].type })
      })
    })
  ))

  return Promise.all(deferreds).then(() => {
    resources.forEach(resource => {
      thenables.push({ then: resolve => {
        resource.type === 'text/css'
          ? injectHead(window, document, 'style', resource, resolve)
          : injectHead(window, document, 'script', resource, resolve)
      }})
    })
    return Promise.all(thenables)
  })
}

export default fetchInject
