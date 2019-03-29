import * as path from "path";
import * as webpack from "webpack";
import MarkoPlugin from "../../../src/plugin";
import ExtractCSSPlugin from "mini-css-extract-plugin";

const markoPlugin = new MarkoPlugin({
  chooseClientCompilerByName($global) {
    return $global.bundle;
  }
});

export default [
  {
    name: "server",
    target: "async-node",
    entry: path.join(__dirname, "server.js"),
    module: {
      rules: [
        {
          test: /\.marko$/,
          loader: "@marko/webpack/loader"
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        "process.env.BUNDLE": true
      }),
      markoPlugin.server
    ]
  },
  ...["A", "B", "C"].map(id => ({
    name: `browser-${id}`,
    output: {
      filename: `[name].${id}.js`
    },
    target: "web",
    module: {
      rules: [
        {
          test: /\.marko$/,
          loader: "@marko/webpack/loader"
        },
        {
          test: /\.css$/,
          use: [ExtractCSSPlugin.loader, "css-loader"]
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        __BUILD_ID__: id
      }),
      new ExtractCSSPlugin({
        filename: `[name].${id}.css`,
        allChunks: true
      }),
      markoPlugin.browser
    ]
  }))
];