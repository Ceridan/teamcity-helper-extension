const webpack = require("webpack");
const merge = require("webpack-merge");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const common = require("./webpack.common.js");
const path = require("path");

module.exports = merge(common, {
    mode: "production",
    plugins: [
      new CleanWebpackPlugin(["dist"], { root: path.join(__dirname, "..") })
    ]
});
