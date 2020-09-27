const webpack = require('webpack');
const { resolve } = require('path')

const { name, version, cssModules } = require('../package.json')
const { library } = require('./library');

const base = {
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },

  output: {
    library,
    libraryTarget: 'umd',
    filename: '[name].js',
    path: resolve(__dirname, '../lib')
  },

  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              cacheDirectory: true,
              presets: [
                '@babel/preset-env',
                '@babel/preset-react',
                '@babel/preset-typescript',
              ],
              plugins: [
                ["@babel/proposal-decorators", { "legacy": true }],
                '@babel/plugin-proposal-class-properties',
                '@babel/plugin-proposal-object-rest-spread',
                '@babel/plugin-proposal-async-generator-functions',
                "@babel/plugin-proposal-optional-chaining",
                ['@babel/plugin-transform-runtime', {
                  'regenerator': true,
                  'helpers': false
                }]
              ]
            }
          },
          {
            loader: 'eslint-loader',
            options: {
              quiet: true,
              failOnError: false,
              fix: false
            }
          }
        ]
      },
      {
        test: /\.less|css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { sourceMap: true },
          },
          {
            loader: 'less-loader',
            options: { sourceMap: true, javascriptEnabled: true},
          },
        ],
      },
    ],
  },

  plugins: [
    new webpack.BannerPlugin({banner: `${name}@${version}`})
  ],

  externals: {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom',
    },
    'react-router-dom': {
      root: 'ReactRouterDOM',
      commonjs2: 'react-router-dom',
      commonjs: 'react-router-dom',
      amd: 'ReactRouterDOM',
    },
    'lodash': {
      root: '_',
      commonjs2: 'lodash',
      commonjs: 'lodash',
      amd: 'lodash',
    },
    antd: {
      root: 'antd',
      commonjs2: 'antd',
      commonjs: 'antd',
      amd: 'antd',
    },
    'moment': 'moment',
    'moment/locale/zh-cn' : 'moment.locale',
    '@ali/mirror-data-engine': {
      root: 'mirrorDataEngine',
      commonjs2: '@ali/mirror-data-engine',
      commonjs: '@ali/mirror-data-engine',
      amd: '@ali/mirror-data-engine',
    },
    '@ali/mirror-view-engine': {
      root: 'mirrorViewEngine',
      commonjs2: '@ali/mirror-view-engine',
      commonjs: '@ali/mirror-view-engine',
      amd: '@ali/mirror-view-engine',
    },
    '@ali/mirror-form': {
      root: 'mirrorForm',
      commonjs2: '@ali/mirror-form',
      commonjs: '@ali/mirror-form',
      amd: '@ali/mirror-form'
    },
    '@ali/mirror-card': {
      root: 'mirrorCard',
      commonjs2: '@ali/mirror-card',
      commonjs: '@ali/mirror-card',
      amd: '@ali/mirror-card',
    },
  },
}

if (cssModules) {
  base.module.rules[1].use[1].options = {
    sourceMap: true,
    modules: true,
    localIdentName: '[local]___[hash:base64:5]',
  }
}

module.exports = base;
