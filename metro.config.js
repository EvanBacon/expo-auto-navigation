const { getDefaultConfig } = require("expo/metro-config");
const navigationRoutesMiddleware = require("./middleware/navigationRoutesMiddleware");

const defaultConfig = getDefaultConfig(__dirname);

// Style copied from Webpack, this is used to identify where code is located.
defaultConfig.serializer.getRunModuleStatement = (moduleId) =>
  `/*! metro-run-module */ __r(${moduleId});`;

defaultConfig.server.enhanceMiddleware = (metroMiddleware, server) => {
  const routesMiddleware = navigationRoutesMiddleware(__dirname);
  return (req, res, next) => {
    if (["/routes"].includes(req.url)) {
      return routesMiddleware(req, res, next);
    }
    return metroMiddleware(req, res, next);
  };
};

module.exports = defaultConfig;
