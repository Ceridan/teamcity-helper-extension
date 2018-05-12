const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  entry: {
    "content-script": path.join(__dirname, "../src/ts/content-script.ts"),
    "options": path.join(__dirname, "../src/ts/options.ts"),
    "background": path.join(__dirname, "../src/ts/background.ts")
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
      { from: "src/css/*.css", to: "css/[name].css" }
    ]),
    new HtmlWebpackPlugin({
      filename: "options.html",
      template: "src/options.html",
      chunks: ["options"]
    })
  ]
};
