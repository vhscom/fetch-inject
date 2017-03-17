# Fetch Inject

[![Build Status](https://travis-ci.org/vhs/fetch-inject.svg?branch=master)](https://travis-ci.org/vhs/fetch-inject)
[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](http://standardjs.com/)
[![NPM Downloads per Month](https://img.shields.io/npm/dm/fetch-inject.svg)](https://www.npmjs.com/package/fetch-inject)
[![NPM Version](https://img.shields.io/npm/v/fetch-inject.svg)](https://www.npmjs.com/package/fetch-inject)

A JavaScript library for dynamically inlining assets into the DOM using Fetch Injection.

## Purpose

Improve website performance and UX by fetching external assets and inlining them into the DOM. Get a Promise in return.

- 398 bytes gzipped
- Zero runtime dependencies
- ES6 Module included

## Background

Read about [why I created this](https://hackcabin.com/post/managing-asynchronous-dependencies-javascript/) on **Hack Cabin**.

## Installing

Fetch Inject is available for testing purposes [via jsDelivr](http://www.jsdelivr.com/projects/fetch-inject), and for production via NPM and Bower.

### For Testing

Add the following to your document `head` and see the [Use Cases](#use-cases) to get a feel for what it can do:

```html
<script src="https://cdn.jsdelivr.net/fetch-inject/latest/fetch-inject.min.js"></script>
```

### For Production

Grab the library from NPM with `npm i fetch-inject` or Bower with `bower install fetch-inject`. Recommended placement shown here:

```html
<head>
  <meta charset="utf-8">
  <script async defer "/js/async/script.js"></script>
  <script>
    (function () {
      if (!window.fetch) return
      // contents of fetch-inject.min.js
      // YOUR CODE HERE
    })()
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
  'bower_components/jquery/dist/jquery.js',
  'bower_components/what-input/dist/what-input.js'
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
  'https://cdn.jsdelivr.net/jquery/3.1.1/jquery.slim.min.js',
  'https://npmcdn.com/tether@1.2.4/dist/js/tether.min.js',
  'https://cdn.jsdelivr.net/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css'
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
This is precisely why `fetchInject` was created:

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

## Limitations

- Currently supports only `script` and `style` elements.
- Relative paths (e.g. `url(default-skin.png)`) may need to be adjusted.

## Supported Runtimes

All ES runtimes with [support for Fetch](http://caniuse.com/#feat=fetch) and [Promises](http://caniuse.com/#search=promises).

<blockquote>
  Fetch will become available in Safari in the Safari 10.1 release that ships with macOS Sierra 10.12.4 and Safari on iOS 10.3.
  <cite>Jon Davis</cite>,  Web Technologies Evangelist
</blockquote>

## Development

1. Clone the repo with `git clone https://github.com/vhs/fetch-inject`.
1. Install dev dependencies with `npm i` (`brew install node` first on macOS).
1. Execute `npm run` for a listing of available commands.

CJS builds for Node possible via the `format` setting in `rollup.config.js`. I have intentionally omitted the `main` property in the package manifest in favor of `module` based on the draft [Node.js Enhancement Proposal for ES6 Modules](https://github.com/nodejs/node-eps/blob/4217dca299d89c8c18ac44c878b5fe9581974ef3/002-es6-modules.md#51-determining-if-source-is-an-es-module).

## Contributing

Please use Issues sparingly. Send in a Pull Request if you feel strongly something needs to be changed. Otherwise, please create a fork and mind the licensing terms. Thank you.

## See Also

- [GitHub's WHATWG Fetch polyfill](https://github.com/github/fetch)
- [isomorphic-fetch](https://github.com/matthew-andrews/isomorphic-fetch)
- [loadCSS](https://github.com/filamentgroup/loadCSS/)


## License

MIT License 2017 © VHS
