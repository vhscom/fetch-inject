<h1 align="center">Fetch Inject</h1>

<p align="center">
  <strong>A library used to dynamically inline assets into the DOM using Fetch Injection.</strong>
</p>

<p align="center">
  <a href="https://travis-ci.org/vhs/fetch-inject">
    <img src="https://travis-ci.org/vhs/fetch-inject.svg?branch=master" alt="Build Status">
  </a>
  <a href="https://cdn.jsdelivr.net/fetch-inject/latest/fetch-inject.min.js">
    <img src="http://img.badgesize.io/https://cdn.jsdelivr.net/fetch-inject/latest/fetch-inject.min.js?compression=gzip" alt="Compressed Release Size">
  </a>
  <a href="https://www.npmjs.com/package/fetch-inject">
    <img src="https://img.shields.io/npm/dm/fetch-inject.svg" alt="NPM downloads per month">
  </a>
  <a href="https://www.npmjs.com/package/fetch-inject">
    <img src="https://img.shields.io/npm/v/fetch-inject.svg" alt="Latest NPM version">
  </a>
</p>

## Background

Fetch Injection is a website performance optimization technique for loading resources into the DOM asynchronously using the [Fetch API](http://devdocs.io/dom/fetch_api). Use it to inject CSS or JavaScript into your page (even across the network), on-demand.

Understand why this library exists by reading the [intro article](https://hackcabin.com/post/managing-async-dependencies-javascript/) on **Hack Cabin**.

Don't have time to read? Here's a playground:<br>
https://codepen.io/vhs/pen/MpVeOE?editors=0012

## Installing

Get it on NPM with `npm i fetch-inject` or Bower with `bower install fetch-inject`.

Also available via CDN [using jsDelivr](http://www.jsdelivr.com/projects/fetch-inject).

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
  console.log(`Finish in less than ${moment().endOf('year').fromNow(true)}`)
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
You have several scripts that depend on one another and you want to load them all asynchronously, without causing a race condition.

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
You want to load some dependencies which require some dependencies, which require a dependency.

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
1. Install dev dependencies with `npm i`.
1. Execute `npm run` for a listing of available commands.

## Contributing

Please use [Issues](https://github.com/vhs/fetch-inject/issues) for bugs and enhancement requests only. Use `npm run commit` to create [Commitizen-friendly](http://commitizen.github.io/cz-cli/) commit messages. If you need support, you know [where to go](http://stackoverflow.com/questions/tagged/fetch-api). Thanks!

## See Also

- [fetch](https://github.com/github/fetch) - Polyfill for `window.fetch`
- [promise-polyfill](https://github.com/taylorhakes/promise-polyfill) - Polyfill for Promises
- [es-module-loader](https://github.com/ModuleLoader/es-module-loader) - Polyfill for the ES Module Loader
- [isomorphic-fetch](https://github.com/matthew-andrews/isomorphic-fetch) - A library for using `fetch` in Node

## License

MIT License 2017 © VHS
