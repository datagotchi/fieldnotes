const path = require("path");
const webpack = require("webpack");
module.exports = {
  devtool: "source-map", // Enable source maps
  entry: path.resolve(__dirname, "./src/index.jsx"), // Your entry point
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"], // To allow importing .jsx files without specifying extension
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  plugins: [
    new (require("html-webpack-plugin"))({
      template: path.resolve(__dirname, "./index.html"),
      filename: "index.html",
      inject: "body",
    }),
  ],
  // Other webpack configurations
};
