import { Component } from "react";

// kiki = lazy
const globalName = "__KIKI__";

const sharedChunks = Object.freeze({
  require: (moduleId: string) => {
    if (moduleId === "react-native") return require("react-native");
    if (moduleId === "react") require("react");
    return null;
  },
});

// This part is specific to Metro bundler, if you want to use a better bundler, you'll need to change this.
export const loadRemoteComponentAsync = async (
  src: string,
  uri: string
): Promise<Component> => {
  // Replace template comment with module access
  src = src.split("/*! metro-run-module */").join('exports["default"] = ');

  // @ts-ignore
  const globalEvalWithSourceUrl = global.globalEvalWithSourceUrl;
  const results = await (() => {
    if (globalEvalWithSourceUrl) {
      return globalEvalWithSourceUrl(src, uri);
    } else {
      return eval(src);
    }
  }).call(global);

  // const results = await new Function(globalName, injected)(global);

  const Component = results.default;

  if (typeof Component !== "function") {
    throw new Error(
      `File is not exporting a React Component as default: ${src}`
    );
  }
  return Component;
};
