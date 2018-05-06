const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");

module.exports = {
  entry: {
    "content-script": path.join(__dirname, "../src/ts/content-script.ts"),
  },
  output: {
    path: path.join(__dirname, "../dist"),
    filename: "js/[name].js"
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: "src/manifest.json" }
    ])
  ]
};
