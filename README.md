<h1 align="center">Fetch Inject</h1>

<p align="center">
  <strong>A library used to dynamically inline content into the DOM using Fetch Injection.</strong>
</p>

<p align="center">
  <a href="https://travis-ci.org/vhs/fetch-inject">
    <img src="https://travis-ci.org/vhs/fetch-inject.svg?branch=master" alt="Build Status">
  </a>
  <a href="https://cdn.jsdelivr.net/fetch-inject/latest/fetch-inject.min.js">
    <img src="http://img.badgesize.io/https://cdn.jsdelivr.net/fetch-inject/latest/fetch-inject.umd.min.js?compression=gzip" alt="Compressed UMD Release Size">
  </a>
  <a href="https://www.npmjs.com/package/fetch-inject">
    <img src="https://img.shields.io/npm/dm/fetch-inject.svg" alt="NPM downloads per month">
  </a>
  <a href="https://www.npmjs.com/package/fetch-inject">
    <img src="https://img.shields.io/npm/v/fetch-inject.svg" alt="Latest NPM version">
  </a>
</p>

## Background

Fetch Injection is performance optimization technique for loading resources into the DOM asynchronously using the [Fetch API](http://devdocs.io/dom/fetch_api). Use it to fetch async resources in parallel (even across the network), and inject them into a document programmatically in a desired sequence.

Understand why this library exists by reading the [intro article](https://hackcabin.com/post/managing-async-dependencies-javascript/) on **Hack Cabin**.

## Waterfalls

A picture's worth a thousand words. These examples are non-blocking and all performed programmatically using Fetch Inject.

Loading Bootstrap 4 asynchronously in parallel:

![Bootstrap 4](https://cloud.githubusercontent.com/assets/440298/24649786/c474c626-195a-11e7-8af8-b0ba0bcc0a71.png "Loading Bootstrap 4 asynchronously in parallel")

Loading jQuery, Transit, Hover Intent and Superfish asynchronously in parallel:

![Superfish](https://cloud.githubusercontent.com/assets/440298/24650610/4a7125d8-195d-11e7-9849-a9e071949c53.png "Loading jQuery, Transit, Hover Intent and Superfish asynchronously in parallel")

Loading PhotoSwipe asynchronously with full-size image deep linking support:

![PhotoSwipe](https://cloud.githubusercontent.com/assets/440298/24689725/13984c50-19fb-11e7-9bbe-384e98d558f9.png "Loading and initializing PhotoSwipe")

## Playground

Test out the library using the latest version available on CDN using this Pen: https://codepen.io/vhs/pen/MpVeOE?editors=0012

## Installing

Fetch Inject is available on NPM, Bower and CDN.

- Get it on NPM with `npm i fetch-inject`
- Bower with `bower install fetch-inject`
- CDN [using jsDelivr](http://www.jsdelivr.com/projects/fetch-inject)

## Syntax

    Promise<Array<Object>> fetchInject(inputs, promise)

### Parameters

<dl>
<dt>inputs<dd><i>Required.</i> This defines the resources you wish to fetch. It must be an <code>Array</code> containing elements of type <a target="devdocs" href="http://devdocs.io/dom/usvstring"><code>USVString</code></a> or <a target="devdocs" href="http://devdocs.io/dom/request"><code>Request</code></a>.
<dt>promise<dd><i>Optional.</i> A <a target="devdocs" href="http://devdocs.io/javascript/global_objects/promise"><code>Promise</code></a> to await before injecting fetched resources.
</dl>

### Return value

A <a target="devdocs" href="http://devdocs.io/javascript/global_objects/promise">Promise</a> that resolves to an `Array` of `Object`s. Each `Object` contains a list of resolved properties of the Response Body used in the module, e.g.

```js
[{
  blob: { size: 44735, type: "application/javascript" },
  text: "/*!↵ * Bootstrap v4.0.0-alpha.5 ... */"
}, {
  blob: { size: 31000, type: "text/css" },
  text: "/*!↵ * Font Awesome 4.7.0 ... */"
}]
```

## Use Cases

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

### Ordering Dependent Scripts

**Problem:**
You have several scripts that depend on one another and you want to load them all asynchronously, in parallel, without causing a race condition.

**Solution:**
Pass `fetchInject` to itself as a second argument, forming a recursion:

```js
fetchInject([
  'https://npmcdn.com/bootstrap@4.0.0-alpha.5/dist/js/bootstrap.min.js'
], fetchInject([
  'https://cdn.jsdelivr.net/jquery/3.1.1/jquery.slim.min.js',
  'https://npmcdn.com/tether@1.2.4/dist/js/tether.min.js'
]))
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
You want to load some dependencies which require some dependencies, which require a dependency. You want it all in parallel, and you want it now.

**Solution:**
You could scatter some `link`s into your document head, blocking initial page render. You could bloat your application bundle with scripts the user might not actually need half the time. Or you could...

```js
const tether = ['https://cdn.jsdelivr.net/tether/1.4.0/tether.min.js']
const drop = [
  'https://cdn.jsdelivr.net/drop/1.4.2/js/drop.min.js'
]
const tooltip = [
  'https://cdn.jsdelivr.net/tooltip/1.2.0/tooltip.min.js',
  'https://cdn.jsdelivr.net/tooltip/1.2.0/tooltip-theme-arrows.css'
]
fetchInject(tooltip,
  fetchInject(drop,
    fetchInject(tether)
  )
).then(() => {
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
- [Dynamic Imports](https://github.com/tc39/proposal-dynamic-import) - `import()` proposal for JavaScript

## License

ISC
