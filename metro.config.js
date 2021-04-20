const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.serializer.getRunModuleStatement = (moduleId) => `/*! metro-run-module */ __r(${moduleId});`;

module.exports = defaultConfig;
