const webpack = require('webpack');
const merge = require('webpack-merge');
const portFinder = require('portfinder');//端口查找
const path = require('path')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');// 友好提示
const config = require('./webpack.base.conf');
const util = require('./util');
// const devApi = require('../env.development')
const devConfig = merge(config,{
  devtool: 'cheap-module-eval-source-map', // 代码追踪
  entry:{
    app:['./src/index.js']
  },
  devServer: {
    hot: true,
    quiet: true, // 关闭 webpack-dev-server 的提示，用 friendly-error-plugin
    overlay: true,
    historyApiFallback: true,
    host: 'localhost',
    overlay:{ warnings: false, errors: true },//出现编译error时，全屏覆盖显示
    clientLogLevel: 'warning', // 控制台提示信息级别是 warning 以上
    proxy:{
      // '/api': {
      //   target: devApi.REQUEST_BASE_URL,
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/api': ''
      //   }
      // },
    },
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    // new webpack.DefinePlugin({
    //   'process.env': devApi
    // })
  ]
})

module.exports = new Promise((resolve, reject) => {
  // 自动检测serve端口是否被占用,自增查找
  portFinder.basePort = 3000;
  portFinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      devConfig.devServer.port = port
      devConfig.plugins.push(
        new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`\n\nApp running At: \n - Local :http://${devConfig.devServer.host}:${port} \n - LAN   :http://${util.getIp}:${port}\n\nHappy development ^_^`],
        },
        onErrors:  undefined
      }))
      resolve(devConfig)
    }
  })
})