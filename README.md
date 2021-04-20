# Auto Navigation

This project demonstrates automatic navigation built on top of react-navigation for the Expo ecosystem. The style is based on Next.js navigation.

Creating files in the `pages/` folder creates new screens for a navigator. Each folder has a `_config.json` file which defines static properties for the navigator.

The `metro.config.js` adds a custom route `/routes` which returns a JSON object that contains file system info.

## Usage

```sh
expo start --ios
```

Reload the app manually with `r` in the console, or shaking the device.

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
