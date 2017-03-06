# fetchInject

Implements _Fetch Injection_ to dynamically inline assets into the DOM using the [Fetch API](http://devdocs.io/dom/fetch_api), with support for promise chains.

## Purpose

Use to inject remote assets into the DOM, then do something with them. Currently supports inlining of `script` _and_ `style` elements.

## Usage

1. Call `fetchInject` with an array of URLs.
1. Optionally, handle the returned `Promise`.

## Use Cases

### Loading Utility Scripts

**Problem:**
You want to prototype some code using the browser as a REPL.

**Solution:**
Skip the emulators and use the real deal:

```js
fetchInject([
  'https://cdn.jsdelivr.net/lodash/4.17.4/lodash.min.js'
]).then(() => {
  console.log(`Successfully loaded Lodash ${_.VERSION}`)
})
```

### Loading CSS Asynchronously

**Problem:**
[PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/) dings you for loading unnecessary styles on initial render.

**Solution:**
Inline your critical path CSS and load [non-critical styles](https://gist.github.com/scottjehl/87176715419617ae6994) asynchronously:

```html
<style>
  *{box-sizing:border-box;text-rendering:geometricPrecision}
</style>
<script>
  fetchInject([
    '/css/non-critical.css',
    'https://cdn.jsdelivr.net/fontawesome/4.7.0/css/font-awesome.min.css'
  ])
</script>
```

### Preventing Script Blocking

**Problem:**
Remote assets can lead to [jank](http://jankfree.org/) or, worse yet, [SPOF](https://www.stevesouders.com/blog/2010/06/01/frontend-spof/) if not handled correctly.

**Solution:**
Asynchronously load remote scripts [without blocking](https://www.stevesouders.com/blog/2009/04/27/loading-scripts-without-blocking/):

```html
<script>fetchInject(['https://use.typekit.net/spoful8r.js'])</script>
```

### Loading Scripts Lazily

**Problem:**
You want to load a script in response to a event without optimistically preloading the asset.

**Solution:**
Create an event listener, respond to the event and then destroy the listener.

```js
const el = document.querySelector('details summary')
el.onclick = (evt) => {
  fetchInject([
    'https://cdn.jsdelivr.net/smooth-scroll/10.2.1/smooth-scroll.min.js'
  ])
  el.onclick = null  
}
```

### Responding to Asynchronous Scripts

**Problem:**
You need to perform a synchronous operation immediately after an asynchronous script is loaded.

**Solution:**
You could create a `script` element and use the [`async`](http://devdocs.io/html/attributes#async-attribute) and `onload` attributes. Or you could...

```js
fetchInject([
  'https://cdn.jsdelivr.net/momentjs/2.17.1/moment.min.js'
]).then(() => {
  console.log(`Finish in less than ${moment().endOf('year').fromNow()}`)
})
```

### Combining Resource Types

**Problem:**
You need to asynchronously download multiple related assets of different types.

**Solution:**
Specify multiple URLs of different types when calling:

```js
fetchInject([
  'https://cdn.jsdelivr.net/normalize/5.0.0/normalize.css',
  '//cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js',
])
```

### Ordering Dependent Scripts

**Problem:**
You have several scripts that depend on one another and you want to load them all asynchronously without causing race conditions.

**Solution:**
Call multiple times, forming a promise chain:

```js
fetchInject([
  'https://cdn.jsdelivr.net/jquery/3.1.1/jquery.slim.min.js'
]).then(() => {
  fetchInject([
    'https://npmcdn.com/tether@1.2.4/dist/js/tether.min.js'
  ]).then(() => {
    fetchInject([
      'https://npmcdn.com/bootstrap@4.0.0-alpha.5/dist/js/bootstrap.min.js'
    ])
  })
})
```

### Loading and Handling Composite Libraries

**Problem:**
You want to use library made up of a number of different resources, and then instantiate it upon completion.

**Solution:**
This is precisely why `fetchInject` was created:

```js
const container = document.querySelectorAll('.pswp')[0]
const items = JSON.parse({{ .Params.gallery.main | jsonify }})
fetchInject([
  '/css/photoswipe.css',
  '/css/default-skin/default-skin.css',
  '/js/photoswipe.min.js',
  '/js/photoswipe-ui-default.min.js'
]).then(() => {
  const gallery = new PhotoSwipe(container, PhotoSwipeUI_Default, items)
  gallery.init()
})
```

## Known Limitations

- Requires you have at least one of `script` or `style` in the `head` of your `document` already, depending on which you're injecting.
- Does not perform any caching.
- Does not support [Isomorphic rendering](http://nerds.airbnb.com/isomorphic-javascript-future-web-apps/).

## Supported Browsers

All browsers with native support the [Fetch API](http://devdocs.io/dom/fetch_api) and ES2015.

## Development

1. Clone the repo with `git clone https://github.com/vhs/fetch-inject.git`.
1. Install dependencies with `npm i` (`brew install node` first on macOS).
1. Modify files in `src` directory and run `npm test` to lint the package.
1. Create a distributable package using `npm run build`.

**Note:** Build variants possible for various module types via the `format` setting in `rollup.config.js`. I intend to switch to ES6 modules as soon as reasonable [browser support](http://caniuse.com/#search=module) is realized.

## Related Libraries

- [`window.fetch` polyfill](https://github.com/github/fetch)
- [loadCSS](https://github.com/filamentgroup/loadCSS/)

Copyright (c) 2017 VHS
