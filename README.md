# Auto Navigation

This project demonstrates automatic navigation built on top of react-navigation for the Expo ecosystem. The style is based on Next.js navigation.

Creating files in the `pages/` folder creates new screens for a navigator. Each folder has a `_config.json` file which defines static properties for the navigator.

The `metro.config.js` adds a custom route `/routes` which returns a JSON object that contains file system info.

## Usage

```sh
expo start --ios
```

Reload the app manually with `r` in the console, or shaking the device.

## Code Loading

In the browser, code loading is often done exclusively with the `<script />` tag:

- `<script />` tag is loaded.
- `src` attribute is downloaded.
- Results are passed to the JavaScript engine.

In native React, we don't have script tags, so we need an alternative approach to passing a string of JavaScript to the JS engine.
Two ways that come to mind are `eval()` which is generally frowned upon in web, and the `new Function(...)` syntax. In this project I opt to code load by making a `fetch` request to download the JavaScript, then I pipe that code into the JS engine by invoking it in `new Function()`:

```js
const results = await new Function(`__GLOBAL_NAME__`, 'var foo = "bar"')(
  global
);
```

Now we just need to make error stack traces work correctly like this... Probably it'd make sense to split this functionality into a code loading library, maybe even make the `new Function()` part into a native method `CodeLoading.loadStringAsync(...)` for speed and security.

## TODO

- [x] Transpile and host code using the Metro dev server
- [x] Export code using Metro config transforms
- [ ] Source maps
- [ ] React Refresh
- [ ] Shallow module loading to improve chunk loading times
- [ ] Store the chunks in the app file system for production and offline support.

## Attribution

Parts of this project are based on [Wormhole](https://github.com/cawfree/react-native-wormhole). The concept is based on Next.js FS based routing for web.

Some parts of the lazy loading reference "Kiki" my lazy sister <3

This project was made possible thanks to the funding and support of Expo.
