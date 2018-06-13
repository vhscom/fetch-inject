<h1 align="center">Fetch Inject</h1>

<p align="center">
  <strong>A fetching async loader and DOM injection sequencer for high-performance websites.</strong>
</p>

<p align="center">
  <a href="https://cost-of-modules.herokuapp.com/?p=fetch-inject@latest">
    <img src="https://img.shields.io/badge/dependencies-0-8892BF.svg?style=flat-square" alt="Zero dependencies">
  </a>
  <a href="https://cdn.jsdelivr.net/npm/fetch-inject">
    <img src="http://img.badgesize.io/https://cdn.jsdelivr.net/npm/fetch-inject@latest/dist/fetch-inject.min.js?compression=brotli&style=flat-square" alt="Size of IIFE bundle with brotli compression">
  </a>
  <a href="https://www.jsdelivr.com/package/npm/fetch-inject">
    <img src="https://data.jsdelivr.com/v1/package/npm/fetch-inject/badge" alt="Hits per month from jsDelivr CDN">
  </a>
  <a href="https://www.npmjs.com/package/fetch-inject">
    <img src="https://img.shields.io/npm/dm/fetch-inject.svg?style=flat-square" alt="NPM downloads per month">
  </a>
  <a href="https://www.npmjs.com/package/fetch-inject">
    <img src="https://img.shields.io/npm/v/fetch-inject.svg?style=flat-square" alt="Latest NPM version">
  </a>
</p>

<p align="center"><strong><a href="https://news.ycombinator.com/item?id=14380191">Discuss it on Hacker News</a></strong></p>

## Background

This library implements a performance optimization technique [known as](https://hackcabin.com/post/managing-async-dependencies-javascript/) _Fetch Injection_ for managing async dependencies with JavaScript. It also works for stylesheets too, and was designed to be extensible for _any_ resource type which can be loaded using [`fetch`](https://devdocs.io/dom-fetch/).

Use Fetch Inject to dynamically import page resources such as JS and CSS in parallel (even across the network), and load them into your page in a desired sequence.

Because it uses [Fetch API](http://devdocs.io/dom/fetch_api), Fetch Inject will work alongside [Service Workers](http://devdocs.io/dom-service-workers/), enabling you take the performance of your [Progressive Web Apps](https://julian.is/article/progressive-web-apps/) to an entirely new level.

## Waterfalls

Here's an example waterfall using Fetch Inject to loading the WordPress Twenty Seventeen theme over 4G with an unprimed browser cache.

![Fetch Inject Unprimed Cache](https://github.com/vhs/fetch-inject/blob/master/docs/fetch-inject-unprimed-cache.png?raw=true)

Click the image for a live demo of the application used to produce the above waterfall.

## Syntax

    Promise<Object[]> fetchInject( inputs[, promise] )

### Parameters

<dl>
<dt>inputs<dd>This defines the resources you wish to fetch. It must be an <code>Array</code> containing elements of type <a target="devdocs" href="http://devdocs.io/dom/usvstring"><code>USVString</code></a> or <a target="devdocs" href="http://devdocs.io/dom/request"><code>Request</code></a>.
<dt>promise<dd><b>Optional.</b> A <a target="devdocs" href="http://devdocs.io/javascript/global_objects/promise"><code>Promise</code></a> to await before injecting fetched resources.
</dl>

### Return value

A [`Promise`](http://devdocs.io/javascript/global_objects/promise) that resolves to an `Array` of `Object`s. Each `Object` contains a list of resolved properties of the [`Response`](http://devdocs.io/dom/response) [`Body`](http://devdocs.io/dom/body) used by the module, e.g.

```js
[{
  blob: { size: 44735, type: "application/javascript" },
  text: "/*!↵ * Bootstrap v4.0.0-alpha.5 ... */"
}, {
  blob: { size: 31000, type: "text/css" },
  text: "/*!↵ * Font Awesome 4.7.0 ... */"
}]
```

## Installing

Fetch Inject is available on NPM and CDN. It ships in the following flavors: IIFE, UMD and ES6.

Save latest minfied UMD bundle to a file with [cURL](https://curl.haxx.se/):

    curl -o fetch-inject.umd.min.js https://cdn.jsdelivr.net/npm/fetch-inject

Add all three bundles to a [Yarn](https://yarnpkg.com/) package:

    yarn add fetch-inject --production

Install the latest `1.7` patch release using [NPM](https://www.npmjs.com/):

    npm i -p fetch-inject@~1.7

Download the `1.8.1` ES6 module using [`fetch`](http://devdocs.io/dom/windoworworkerglobalscope/fetch):

```js
fetch('https://cdn.jsdelivr.net/npm/fetch-inject@1.8.1/dist/fetch-inject.es.min.js')
```

For asset pipelines requiring vanilla AMD or CJS modules see the [Development](#development) section.

## Use Cases

Try the [Fetch Inject Playground on CodePen](https://codepen.io/vhs/pen/MpVeOE?editors=0012) while referencing the following use cases to enhance your understanding of what this library can do for you.

### Preventing Script Blocking

**Problem:**
External scripts can lead to [jank](http://jankfree.org/) or [SPOF](https://www.stevesouders.com/blog/2010/06/01/frontend-spof/) if not handled correctly.

**Solution:**
Load external scripts [without blocking](https://www.stevesouders.com/blog/2009/04/27/loading-scripts-without-blocking/):

```html
fetchInject([
  'https://cdn.jsdelivr.net/popper.js/1.0.0-beta.3/popper.min.js'
])
```

This is a simple case to get you started. Don't worry, it gets better.

### Loading Non-critical CSS

**Problem:**
[PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/) and [Lighthouse](https://chrome.google.com/webstore/detail/lighthouse/blipmdconlkpinefehnmjammfjpmpbjk) ding you for loading unnecessary styles on initial render.

**Solution:**
Inline your critical CSS and load [non-critical styles](https://gist.github.com/scottjehl/87176715419617ae6994) asynchronously:

```html
<style>/*! bulma.io v0.4.0 ... */</style>
<script>
fetchInject([
  '/css/non-critical.css',
  'https://cdn.jsdelivr.net/fontawesome/4.7.0/css/font-awesome.min.css'
])
</script>
```

Unlike [`loadCSS`](https://github.com/filamentgroup/loadCSS/), Fetch Inject is smaller, doesn't use callbacks and ships a minifed UMD build for interop with CommonJS.

### Lazyloading Scripts

**Problem:**
You want to load a script in response to a user interaction without affecting your page load times.

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

Here we are loading the smooth scroll polyfill when a user opens a [details](http://devdocs.io/html/element/details) element, useful for displaying a collapsed and keyboard-friendly table of contents.

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

### Ordering Script Dependencies

**Problem:**
You have several scripts that depend on one another and you want to load them all asynchronously, in parallel, without causing race conditions.

**Solution:**
Pass `fetchInject` to itself as a second argument, forming a promise recursion:

```js
fetchInject([
  'https://npmcdn.com/bootstrap@4.0.0-alpha.5/dist/js/bootstrap.min.js'
], fetchInject([
  'https://cdn.jsdelivr.net/jquery/3.1.1/jquery.slim.min.js',
  'https://npmcdn.com/tether@1.2.4/dist/js/tether.min.js'
]))
```

### Managing Asynchronous Dependencies

**Problem:**
You want to load some dependencies which require some dependencies, which require some dependencies. You want it all in parallel, and you want it now.

**Solution:**
You could scatter some `link`s into your document head, blocking initial page render, bloat your application bundle with scripts the user might not actually need. Or you could...

```js
const tether = ['https://cdn.jsdelivr.net/tether/1.4.0/tether.min.js']
const drop = ['https://cdn.jsdelivr.net/drop/1.4.2/js/drop.min.js']
const tooltip = [
  'https://cdn.jsdelivr.net/tooltip/1.2.0/tooltip.min.js',
  'https://cdn.jsdelivr.net/tooltip/1.2.0/tooltip-theme-arrows.css'
]
fetchInject(tooltip, fetchInject(drop, fetchInject(tether)))
  .then(() => {
    new Tooltip({
      target: document.querySelector('h1'),
      content: "You moused over the first <b>H1</b>!",
      classes: 'tooltip-theme-arrows',
      position: 'bottom center'
    })
  })
```

What about jQuery dropdown menus? Sure why not...

```js
fetchInject([
  '/assets/js/main.js'
], fetchInject([
  '/assets/js/vendor/superfish.min.js'
], fetchInject([
  '/assets/js/vendor/jquery.transit.min.js',
  '/assets/js/vendor/jquery.hoverIntent.js'
], fetchInject([
  '/assets/js/vendor/jquery.min.js'
]))))
```

### Loading and Handling Composite Libraries

**Problem:**
You want to deep link to gallery images using [PhotoSwipe](http://photoswipe.com/) without slowing down your page.

**Solution:**
Download everything in parallel and instantiate when finished:

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

This example turns TOML into JSON, parses the object, downloads all of the PhotoSwipe goodies and then activates the PhotoSwipe gallery immediately when the interface is ready to be displayed.

## Supported Browsers

All browsers with support for [Fetch](http://caniuse.com/#feat=fetch) and [Promises](http://caniuse.com/#search=promises). Because Fetch is a newer Web standard, we will help identify, open and track issues against browser implementations as they arise while specs are being finalized.

## Progressive Enhancement

You don't need to polyfill fetch for older browsers when they already know how to load external scripts. Give them a satisfactory fallback experience instead.

In your document `head` get the async loading started right away if the browser supports it:

```js
(function () {
  if (!window.fetch) return;
  fetchInject([
    '/js/bootstrap.min.js'
  ], fetchInject([
    '/js/jquery.slim.min.js',
    '/js/tether.min.js'
  ]))
})()
```

Then, before the close of the document `body` (if JS) or in the `head` (if CSS), provide the traditional experience:

```js
(function () {
  if (window.fetch) return;
  document.write('<script src="/js/bootstrap.min.js"><\/script>');
  document.write('<script src="/js/jquery.slim.min.jss"><\/script>');
  document.write('<script src="/js/tether.min.js"><\/script>');
})()
```

This is entirely optional, but a good practice unless you're going full hipster.

## Development

1. Clone the repo.
1. Install dev dependencies.
1. Execute `npm run` for a listing of available commands.

If you need vanilla AMD or CJS modules, update `activeConfigs` in `rollup.config.js`.

## Contributing

Please use [Issues](https://github.com/vhs/fetch-inject/issues) for bugs and enhancement requests only. Bug reports not accompanied by a reduced test case, sufficient backing research and information to help progress the library may be closed without explanation.

When submitting pull requests, use `npm run commit` to create [Commitizen-friendly](http://commitizen.github.io/cz-cli/) commit messages. Pulls should be squashed into a single commit prior to review and should PR against a backing issue.

If you need support, you know [where to go](http://stackoverflow.com/questions/tagged/fetch-api).

## See Also

- [fetch](https://github.com/github/fetch) - Polyfill for `window.fetch`
- [promise-polyfill](https://github.com/taylorhakes/promise-polyfill) - Polyfill for Promises
- [es-module-loader](https://github.com/ModuleLoader/es-module-loader) - Polyfill for the ES Module Loader
- [isomorphic-fetch](https://github.com/matthew-andrews/isomorphic-fetch) - A library for using `fetch` in Node
- [Dynamic Imports](https://github.com/tc39/proposal-dynamic-import) - `import()` proposal for JavaScript

## WordPress Plugin

Fetch Inject has been built into a WordPress plugin, enabling Fetch Injection to work within WordPress. [Initial testing](https://hackernoon.com/putting-wordpress-into-hyperdrive-4705450dffc2) shows Fetch Injection enables WordPress to load pages **300% faster** than conventional methods.

[![Hyperdrive WordPress Plugin logo](https://github.com/wp-id/hyperdrive/blob/master/logo.png?raw=true)](https://github.com/wp-id/hyperdrive)

Access the plugin beta [Hyperdrive repo](https://github.com/wp-id/hyperdrive) on GitHub and see the related [Hacker Noon article](https://hackernoon.com/putting-wordpress-into-hyperdrive-4705450dffc2) for more details.

## License

© 2017, <a href="bitcoin:13AMDq9isKtQTxMQG4w7Yo7cEhqKAqQ4Lz?label=Comfusion&message=Donation%20for%Fetch%20Inject">13AMDq9isKtQTxMQG4w7Yo7cEhqKAqQ4Lz</a>

[![Fetch Inject](https://static.hackcabin.com/images/qr/btc-license.png)](https://hackernoon.com/introducing-the-btc-license-28650887eb11)
