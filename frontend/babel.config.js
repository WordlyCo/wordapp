module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // Only keep Reanimated plugin
      "react-native-reanimated/plugin",
    ],
  };
};
