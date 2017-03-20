# Fetch Inject

[![Build Status](https://travis-ci.org/vhs/fetch-inject.svg?branch=master)](https://travis-ci.org/vhs/fetch-inject)
[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](http://standardjs.com/)
[![NPM Downloads per Month](https://img.shields.io/npm/dm/fetch-inject.svg)](https://www.npmjs.com/package/fetch-inject)
[![NPM Version](https://img.shields.io/npm/v/fetch-inject.svg)](https://www.npmjs.com/package/fetch-inject)

Dynamically inline assets into the DOM using Fetch Injection.

## Purpose

Improve website performance and UX by fetching external assets and inlining them into the DOM programmatically. Get a Promise in return.

- 398 bytes gzipped
- Zero runtime dependencies
- ES6 Module included

## Background

Learn about _Fetch Injection_ and [why I created this library](https://hackcabin.com/post/managing-asynchronous-dependencies-javascript/) on **Hack Cabin**.

## Installing

Fetch Inject is available for testing purposes [via jsDelivr](http://www.jsdelivr.com/projects/fetch-inject), and for production via NPM and Bower.

### For Testing

Add the following to your document `head` and see the [Use Cases](#use-cases) to get a feel for what it can do:

```html
<script src="https://cdn.jsdelivr.net/fetch-inject/latest/fetch-inject.min.js"></script>
```

### For Production

Grab the library from NPM with `npm i fetch-inject` or Bower with `bower install fetch-inject`. Suggested placement shown here:

```html
<head>
  <meta charset="utf-8">
  <script async defer "/js/vendor/script.js"></script>
  <script>
    (function (window, document, undefined) {
      if !(window.fetch) return
      // contents of fetch-inject.min.js
      // YOUR CODE HERE
    })(window, document)
  </script>
</head>
```

To fallback for older browsers `document.write` and `noscript` are your friends.

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
[PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/) dings you for loading blocking CSS and unnecessary styles on initial render.

**Solution:**
Inline your critical path CSS and load [non-critical styles](https://gist.github.com/scottjehl/87176715419617ae6994) asynchronously:

```js
fetchInject([
  '/css/non-critical.css',
  'https://cdn.jsdelivr.net/fontawesome/4.7.0/css/font-awesome.min.css'
])
```

### Preventing Script Blocking

**Problem:**
Remote assets can lead to [jank](http://jankfree.org/) or, worse yet, [SPOF](https://www.stevesouders.com/blog/2010/06/01/frontend-spof/) if not handled correctly.

**Solution:**
Asynchronously load remote scripts [without blocking](https://www.stevesouders.com/blog/2009/04/27/loading-scripts-without-blocking/):

```html
fetchInject([
  '/bower_components/jquery/dist/jquery.js',
  '/bower_components/what-input/dist/what-input.js'
])
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
  'https://cdn.jsdelivr.net/drop/1.4.2/js/drop.min.js',
  'https://cdn.jsdelivr.net/drop/1.4.2/css/drop-theme-arrows-bounce.min.css'
])
```

### Ordering Dependent Scripts

**Problem:**
You have several scripts that depend on one another and you want to load them all asynchronously without causing race conditions.

**Solution:**
Call multiple times, forming a promise chain:

```js
fetchInject([
  'https://cdn.jsdelivr.net/jquery/3.1.1/jquery.slim.min.js',
  'https://npmcdn.com/tether@1.2.4/dist/js/tether.min.js',
]).then(() => {
  fetchInject([
    'https://npmcdn.com/bootstrap@4.0.0-alpha.5/dist/js/bootstrap.min.js'
  ])
})
```

### Loading and Handling Composite Libraries

**Problem:**
You want to use library composed of several resources and initialize it as soon as possible.

**Solution:**
This is precisely the kind of activity `fetchInject` works best at:

```js
const container = document.querySelector('.pswp')
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

### Managing Asynchronous Dependencies

**Problem:**
You want to load some dependencies which requires some dependencies, which requires a dependency.

**Solution:**
You could scatter some `link`s into your document head, blocking initial page render and bloat your application bundle. Or...

```js
const tether = ['/js/tether.min.js']
const drop = [
  '/js/drop.min.js',
  '/css/drop-theme-arrows-bounce.min.css'
]
const tooltip = [
  '/js/tooltip.min.js',
  '/css/tooltip-theme-arrows.css'
]
fetchInject(tether)
  .then(() => fetchInject(drop))
  .then(() => fetchInject(tooltip))
  .then(() => {
    new Tooltip({
      target: document.querySelector('h1'),
      content: "You moused over the first <b>H1</b>!",
      classes: 'tooltip-theme-arrows',
      position: 'bottom center'
    })
  })
```

## Supported Browsers

All browsers with support for [Fetch](http://caniuse.com/#feat=fetch) and [Promises](http://caniuse.com/#search=promises).

<blockquote>
  Fetch will become available in Safari in the Safari 10.1 release that ships with macOS Sierra 10.12.4 and Safari on iOS 10.3.
  <cite>Jon Davis</cite>,  Web Technologies Evangelist
</blockquote>

## Development

1. Clone the repo with `git clone https://github.com/vhs/fetch-inject`.
1. Install dev dependencies with `npm i` (`brew install node` first on macOS).
1. Execute `npm run` for a listing of available commands.

## Contributing

Please use [Issues](https://github.com/vhs/fetch-inject/issues) for bugs and enhancement requests only. If you need support, you know [where to go](http://stackoverflow.com/). Thanks!

## See Also

- [fetch](https://github.com/github/fetch) - Polyfill for `window.fetch`
- [promise-polyfill](https://github.com/taylorhakes/promise-polyfill) - Polyfill for Promises
- [es-module-loader](https://github.com/ModuleLoader/es-module-loader) - Polyfill for the ES Module Loader
- [isomorphic-fetch](https://github.com/matthew-andrews/isomorphic-fetch) - A library for using `fetch` in Node

## License

MIT License 2017 © VHS
