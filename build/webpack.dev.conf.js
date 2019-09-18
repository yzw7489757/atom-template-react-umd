const merge = require('webpack-merge');
const portFinder = require('portfinder'); // 端口查找
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');// 友好提示
const open = require('opn');
const config = require('./webpack.base.conf');
const { resolve, getIp } = require('./util');

const devConfig = merge(config, {
  devtool: 'cheap-module-eval-source-map', // 代码追踪
  entry: {
    app: ['react-hot-loader/patch', resolve('./src/index.js')],
  },
  devServer: {
    hot: true,
    quiet: true,
    historyApiFallback: true,
    host: 'localhost',
    overlay: { warnings: false, errors: true }, // 出现编译error时，全屏覆盖显示
    clientLogLevel: 'warning', // 控制台提示信息级别是 warning 以上
    after() {
      open(`http://localhost:${this.port}`);
    },
    proxy: {
      // '/api': {
      //   target: devApi.REQUEST_BASE_URL,
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/api': ''
      //   }
      // },
    },

  },
  resolve: {
    alias: {
      'react-dom': resolve('./node_modules/@hot-loader/react-dom'),
      '@': resolve('./src/'),
      view: resolve('./src/views/'),
      assets: resolve('./src/assets/'),
    },
    extensions: ['.js', '.less', '.json'],
  },
});

module.exports = new Promise((r, j) => {
  // 自动检测serve端口是否被占用,自增查找
  portFinder.basePort = 3000;
  portFinder.getPort((err, port) => {
    if (err) {
      j(err);
    } else {
      devConfig.devServer.port = port;
      devConfig.plugins.push(
        new FriendlyErrorsPlugin({
          compilationSuccessInfo: {
            messages: [`\n\nApp running At: \n - Local :http://${devConfig.devServer.host}:${port} \n - LAN   :http://${getIp()}:${port}\n\nHappy development ^_^`],
          },
          onErrors: undefined,
        }),
      );
      r(devConfig);
    }
  });
});
