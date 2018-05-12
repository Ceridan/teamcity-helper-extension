const webpack = require("webpack");
const merge = require("webpack-merge");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  devtool: "inline-source-map",
  mode: "development",
  plugins: [
    new CopyWebpackPlugin([
      {
        from: "src/manifest.json",
        transform: (content, path) => content.toString().replace("\"persistent\": false", "\"persistent\": true")
      }
    ])
  ]
});
