const path = require("path");

module.exports = {
  mode: 'development',
  entry: "./typescript/frontend/main/main.ts",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "./public/script/"),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  devtool: "source-map", // for easier debugging
  devServer: {
    static: {
      directory: path.join(__dirname, "./public/script/"),
    },
    compress: true,
    port: 9000,
  },
};
