import {
  script as injectScript,
  style as injectStyle
} from './injectors'

export default function (urls) {
  const resources = []
  const deferreds = []
  const thenables = []

  urls.forEach((url) => deferreds.push(
    window.fetch(url).then(res => {
      return [res.clone().text(), res.blob()]
    }).then(kvArrays => {
      return Promise.all(kvArrays).then((kvArray) => {
        resources.push({ text: kvArray[0], type: kvArray[1].type })
      })
    })
  ))

  return Promise.all(deferreds).then(() => {
    resources.forEach((resource) => {
      thenables.push({ then: (resolve) => {
        if (resource.type === 'application/javascript') {
          injectScript(window, document, 'script', resource.text, resolve())
        } else if (resource.type === 'text/css') {
          injectStyle(window, document, 'style', resource.text)
          resolve()
        }
      }})
    })
    return Promise.all(thenables)
  })
}
