const NODE_ENV = process.env.NODE_ENV || "development";
console.log("NODE_ENV=", NODE_ENV);

const webpack = require("webpack");
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require("html-webpack-plugin");
// const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const rimraf = require("rimraf");

function addHash(template, hash) {
  return "production" === NODE_ENV ? template.replace(/\.[^.]+$/, `.[${hash}]$&`) : `${template}?hash=[${hash}]`;
}

module.exports = {
  entry: path.join(__dirname, "/app/main"),
  output: {
    path: path.join(__dirname, "/dist"),
    publicPath: "/",
    filename: addHash("[name].js", "development" === NODE_ENV ? "hash" : "chunkhash"),
    library: "[name]",
  },

  watchOptions: {
    aggregateTimeout: 100,
  },

  devtool: "production" !== NODE_ENV ? "inline-source-map" : false,

  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(NODE_ENV),
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: "common",
      minChunk: 3,
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
    }),
    new CopyWebpackPlugin([{
      from: path.join(__dirname, "/public"),
    }]),
    new ExtractTextPlugin({
      filename: addHash("[name].css", "contenthash"),
      allChunks: true,
      disable: "production" !== NODE_ENV,
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      options: {
        postcss: [autoprefixer],
      },
    }),
    new HtmlWebpackPlugin({
      filename: "index.html",
      chunks: ["common", "main"],
      template: path.join(__dirname, "/public/index.html"),
    }),
  ],

  resolve: {
    modules: ["node_modules"],
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: "babel-loader?presets[]=es2015",
      },
      {
        test: /\.html$/,
        use: "html-loader",
      },
      {
        test: /\.?css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader!postcss-loader!sass-loader",
          publicPath: "/dist",
        }),
      },
      {
        test: /\.(ico|png|jpg|svg|ttf|eot|woff|woff2)$/,
        use: addHash("file?name=[path][name].[ext]", "hash:6"),
        // loader: "file?name=[1].[ext]&options.regExp=node_modules/(.*)"
      },
    ],

    noParse: /node_modules\/(bootstrap|jquery)/,
  },
};

if ("production" === NODE_ENV) {
  module.exports.devtool = false;
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        pure_funcs: ["console.log", "window.console.log.apply"]
      },
      output: {
        comments: false,
      },
    }),
  ]);
  module.exports.plugins.push(
    {
      apply: (compiler) => {
        console.log(`Remove: ${compiler.options.output.path}`);
        "production" === NODE_ENV && rimraf.sync(compiler.options.output.path);
      },
    }
  );
}
