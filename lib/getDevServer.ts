import { Platform } from "react-native";
import querystring from "querystring";
// Internals are dangerous and subject to change...
// This uses some native module to get the dev server URL that the native code loading used to download the initial bundle.
import getDevServer from "react-native/Libraries/Core/Devtools/getDevServer";

// Get the dev server URL
const baseURL = getDevServer().url;

export function getDevServerUrl() {
  return baseURL;
}

/**
 * Create a string like: http://192.168.1.76:19000/screens/home.bundle?platform=ios&dev=true&hot=false&minify=false&modulesOnly=true&shallow=true&runModule=false
 *
 * @param filePath screens/home -- no extension
 * @param qs
 */
export function getDevServerUrlForFilePath(
  filePath: string,
  {
    hot = false,
    runModule = true,
    shallow = false,
    modulesOnly = true,
  }: {
    hot?: boolean;
    runModule?: boolean;
    modulesOnly?: boolean;
    shallow?: boolean;
  } = {}
) {
  const qs = querystring.stringify({
    platform: Platform.OS,
    dev: !!__DEV__,
    hot: !!hot,
    minify: !__DEV__,
    modulesOnly: !!modulesOnly,
    shallow: !!shallow,
    runModule: !!runModule,
  });

  // Using `.bundle` as the file extension will tell metro that it needs to transpile the input file,
  // passing in the normal file extension will simply return the file verbatim.

  return `${getDevServerUrl()}${filePath}.bundle?${qs}`;
}
