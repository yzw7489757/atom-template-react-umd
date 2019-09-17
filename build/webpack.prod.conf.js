const glob = require('glob')
const webpack = require('webpack')
const merge = require('webpack-merge'); // 合并配置
const CopyWebpackPlugin = require('copy-webpack-plugin');// 将单个文件或整个目录复制到构建目录。
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer'); // 打包分析
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');// 用于优化或者压缩CSS资源
const AutoDllPlugin = require('autodll-webpack-plugin'); //dll动态链接库
const CompressionWebpackPlugin = require('compression-webpack-plugin'); // gzip压缩
const Uglify = require("uglifyjs-webpack-plugin"); // 压缩js es6
const { resolve ,dllModule} = require('./util');
const productionGzipExtensions = ['js', 'css']
const config = require('./webpack.base.conf');
const path = require('path')
const { name } = require('../package.json')

// 用来在本地打包时分析，webpack-cli 启动时添加 --report 参数
// 不用该形式 webpack 会报错，该参数只用来此处判断，并无 webpack 相关作用
const getAnalyzerPlugin = () => {
 return process.argv.includes('--report')?[new BundleAnalyzerPlugin()]:[] 
};

module.exports = merge(config, {
  bail: true, // 出现错误立即停止打包
  plugins: [
    new CopyWebpackPlugin([
      {
        from: resolve('src/assets'),
        to: resolve('dist/static'),
      },
    ]),
    new OptimizeCSSAssetsPlugin({
        assetNameRegExp: /\.css\.*(?!.*map)/g,
        cssProcessor: require('cssnano'),
        cssProcessorOptions: {
          discardComments: { removeAll: true },// 避免 cssnano 重新计算 z-index
          safe: true,
          autoprefixer: false // 关闭自带的autoprefixer
      },
      canPrint: true
    }),
    new CompressionWebpackPlugin({
      filename: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
      threshold: 10240,
      minRatio: 0.8
    }),
    ...getAnalyzerPlugin(),
    new AutoDllPlugin({
      inject: true,
      filename: '[name]_[hash].dll.js',
      path: './dll',
      entry: {
        vendor:[...dllModule]
      }
    }),
  ],
  performance: {
    assetFilter: function(assetFilename) {
      return assetFilename.endsWith('.js');
    },
    maxAssetSize: 200000,
    hints: false
  },
  optimization: {
    minimizer: [
      // 自定义js优化配置，将会覆盖默认配置
      new UglifyJsPlugin({
        exclude: /\.min\.js$/, // 过滤掉以".min.js"结尾的文件，我们认为这个后缀本身就是已经压缩好的代码，没必要进行二次压缩
        cache: true,
        parallel: true, // 开启并行压缩，充分利用cpu
        sourceMap: false,
        extractComments: false, // 移除注释
        uglifyOptions: {
          compress: {
            unused: true,
            drop_debugger: true
          },
          output: {
            comments: false
          }
        }
      }),
      // 用于优化css文件
      new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.(le|c)ss$/g,
        cssProcessorOptions: {
          safe: true,
          autoprefixer: { disable: true }, // 这里是个大坑，稍后会提到
          mergeLonghand: false,
          discardComments: {
            removeAll: true // 移除注释
          }
        },
        canPrint: true
      })
    ],
    splitChunks: {
      chunks: 'initial', // 从哪些chunks里面抽取代码，可选 all，针对异步分割或者全部分割
      minSize: 30000, // 低于 30kb 的文件不分割
      maxSize: 0, // 分割前文件最大体积，0表示不限制
      minChunks: 2, // 被引用次数
      maxAsyncRequests: 5, // 最大异步加载次数
      maxInitialRequests: 3, // 最大初始请求数
      automaticNameDelimiter: '~', // 分割出的文件中间连接符
      name: true, // 表示分割出的文件自动生成文件名
      cacheGroups: { // 缓存组，可将多个 chunk 打包到一起，成一个 vendor 文件
        vendor: { // 类似 webpack 的 entry 里的属性名，会生成一个 vendors~webpack.entry.filename 的一个文件名
          test: /[\\/]node_modules[\\/]/, // 分割规则
          priority: -10, // 优先级，在同时满足 cacheGroups 下所有的内容时，优先采用哪一个条件
          minSize: 0,
          maxSize: 50000
          // filename: '[name].bundle.js', // 可设置项目，自定义文件名
        },
        default: { // 不符合 vendors 的 test 规则时
          minChunks: 2, // 最小引用次数
          priority: -20, // 优先级，-20 比 -10 要低，也就是在两者条件都满足下，会先采用 vendors 的分割规则
          reuseExistingChunk: true, // 表示是否使用已有的 chunk，如果为 true 则表示如果当前的 chunk 包含的模块已经被抽取出去了，那么将不会重新生成新的。
        },
        common: { // 公共模块代码抽离
          name:'common',
          chunks: 'initial', // 从入口开始，不考虑异步
          minChunks: 2,
        },
        styles: {
          name: 'styles',
          test: /\.(le|c)ss$/,
          chunks: 'all',
          enforce: true,
          priority: 20
        }
      },
    }
  }
});
