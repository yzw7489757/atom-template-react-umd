const webpack = require('webpack')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin');
const WebpackBuildNotifierPlugin = require('webpack-build-notifier');
const WebpackBar = require('webpackbar');
const path = require('path')
const { name } = require('../package.json')
const {
  IS_PROD,
  resolve,
  eslint,
  htmlPlugins
} = require('./util');
const Env = require('./env')
const HappyPack = require('happypack');
const os = require('os');
const HappyThreadPool = HappyPack.ThreadPool({
  size: os.cpus().length
});


module.exports = {
  mode: process.env.NODE_ENV,
  output: {
    publicPath: '/',
    path: resolve('dist'),
    filename: 'js/[name].[hash].js',
    chunkFilename: 'js/[name].bundle.js',
  },
  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      '@': resolve('src'),
      'public': resolve('public'),
      'views': resolve('src/views')
    }
  },
  module: {
    rules: [
      ...eslint(),
      {
        test: /\.module\.(le|c)ss$/,
        use: 'Happypack/loader?id=ModuleLess'
      },
      {
        test: /.(le|c)ss$/, // 非模块化
        exclude:/\.module\.(le|c)ss$/,
        use: 'Happypack/loader?id=Less'
      },
      {
        test: /.(js|jsx)$/,
        exclude: /node_modules/,
        use: [{
            loader: "Happypack/loader?id=Babel"
          },
          {
            loader: 'react-hot-loader/webpack',
            options: {
              babelrc: true,
              plugins: ['react-hot-loader/babel'],
            }
          }
        ],
        include: resolve('src'),
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10240,
          name: 'images/[name].[hash:7].[ext]',
        },
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10240,
          name: 'media/[name].[hash:7].[ext]',
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          name: '[name]-[hash:5].min.[ext]',
          limit: 5000,
          publicPath: 'fonts/',
          outputPath: 'fonts/'
        }
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    ...htmlPlugins(),
    new webpack.DefinePlugin({
      'process.env': Env
    }),
    new MiniCssExtractPlugin({
      filename: "[name]_[hash:8].css",
      chunkFilename: "[name]_[id].css"
    }),
    new HappyPack({
      id: 'Less',
      use: [
        IS_PROD ? MiniCssExtractPlugin.loader : "style-loader",
        "css-loader",
        "postcss-loader",
        "less-loader"
      ]
    }),
    new HappyPack({
      id: 'ModuleLess',
      use: [
        IS_PROD ? MiniCssExtractPlugin.loader : "style-loader",
        {
          loader: "css-loader",
          options: {
            sourceMap: !IS_PROD,
            modules: {
              localIdentName: "[local]___[hash:base64:5]"
            },
          }
        },
        "postcss-loader",
        "less-loader"
      ]
    }),
    new HappyPack({
      id: 'Babel',
      loaders: [{
        loader: 'babel-loader?cacheDirectory=true',
      }],
      threadPool: HappyThreadPool,
      verbose: true,
    }),
    new WebpackBar({
      profile:true,
      name
    }),
    new WebpackBuildNotifierPlugin({
      title: name + IS_PROD?' Successful Build':' Successful startup is Running',
      logo: path.resolve("../public/favicon.png"),
      suppressSuccess: 'initial'
    })
  ]
};