const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path')
const { IS_PROD, resolve, eslint, cssLoaders } = require('./util');
const HappyPack = require('happypack');
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

const PROHtmlPlugins = () => {
  const template = path.resolve(__dirname, '../public/index.html')
  return IS_PROD ? [
    new HtmlWebpackPlugin({
      template,
      inject:true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
      },
      chunksSortMode:'none'
    })
  ] : [new HtmlWebpackPlugin({
      template,
      inject:true,
      chunksSortMode:'none'
  })]
}
module.exports = {
  mode: process.env.NODE_ENV,
  entry: {
    app: './src/index.js',
  },
  output: {
    publicPath: '/' ,
    path: resolve('dist'),
    filename: 'js/[name].[hash].js',
    chunkFilename: 'js/[name].bundle.js',
  },
  resolve: {
    alias:{
      '@': resolve('src'),
      'public':resolve('public'),
      'views':resolve('src/views'),
    }
  },
  module: {
    rules: [
      ...eslint,
      ...cssLoaders,
      {
        test: /.(js|jsx)$/,
        exclude: /node_modules/,
        use:[
          {
            loader: "happypack/loader?id=happyBabel"
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
    ...PROHtmlPlugins(),
    new MiniCssExtractPlugin({
      filename: "[name]_[hash].css",
      chunkFilename: "[name]_[id].css"
    }),
    new HappyPack({
      id: 'happyBabel',
      loaders: [{
          loader: 'babel-loader?cacheDirectory=true',
      }],
      threadPool: happyThreadPool,
      verbose: true,
  })
  ],
  stats: {
    children: false, // 避免过多子信息
    builtAt: true, // 添加构建日期和构建时间信息
    cached: true, // 添加缓存（但未构建）模块的信息
    cachedAssets: true, // 显示缓存的资源（将其设置为 `false` 则仅显示输出的文件）
  }
};