'use strict';
const os = require('os');
const path = require('path');
const formatter = require('eslint-friendly-formatter')
const threadLoader = require('thread-loader');
const { loader : miniCssLoad } = require("mini-css-extract-plugin");
const resolve = dir => path.resolve(__dirname, '../', dir);
const IS_PROD = process.env.NODE_ENV === 'production';

const { dependencies } = require('../package');
const vendors = Object.keys(dependencies);// dll
const excludeVendors = []; // 不打包进 vendor 的依赖

excludeVendors.forEach((dep) => {
  const index = vendors.indexOf(dep);
  if (index > -1) {
    vendors.splice(index, 1);
  }
});

// eslint 配置
const getEslintRules = () => {
  let eslint = [];
  if (!IS_PROD) {
    eslint = [{
      test: /\.(js|jsx)$/,
      loader: 'eslint-loader',
      enforce: 'pre',
      exclude: /node_modules/,
      include: resolve('src'),
      options: {
        formatter,
        emitWarning: true,
      },
    }];
  }
  return eslint;
};

// css loader 配置
const cssLoaders = () => {
  
  const loader = (loader, obj = {}) => {
    return {
      loader: `${loader}-loader`,
      ...obj
    }
  }

  const generateCssLoaders = (loaderName) => {
    const baseLoader = [loader('css')].concat(IS_PROD ? loader('postcss'):[]);
    loaderName && baseLoader.push(loader(`${loaderName}`));
    IS_PROD && baseLoader.unshift(miniCssLoad);    // 如果是生产环境就引入提取 css 的 loader
    return [...baseLoader];
  };

  const loaderObj = {
    css: ["style-loader",...generateCssLoaders()],
    '(scss|sass)': [ "style-loader",...generateCssLoaders('sass')], // [MiniCssExtractPlugin.loader,'style-loader', 'css-loader', 'sass-loader']
  };

  const loaders = [];
  for (const name in loaderObj) {
    loaders.push({
      test: new RegExp(`\\.${name}$`),
      use: loaderObj[name]
    });
  }
  return loaders;
};

// 缓存配置，优化打包速度
const optimizeLoaders = (dir, name) => [{
    loader: 'cache-loader',
    options: {
      cacheDirectory: resolve(`.cache/${dir}`),
    },
  },
  {
    loader: 'thread-loader',
    options: {
      name,
      workers: os.cpus().length - 1,
      workerParallelJobs: 50,
      workerNodeArgs: ['--max-old-space-size=1024'],
      poolRespawn: !!IS_PROD,
      poolTimeout: 2000,
      poolParallelJobs: 50,
    },
  },
];

function getIPAdress() {
  // 获取本地ip 开启局域网访问
  var interfaces = os.networkInterfaces();　　
  for (var devName in interfaces) {　　　　
      var iface = interfaces[devName];　　　　　　
      for (var i = 0; i < iface.length; i++) {
          var alias = iface[i];
          if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
              return alias.address;
          }
      }　　
  }
}

module.exports = {
  IS_PROD,
  resolve,
  dllModule:vendors,
  getIp:getIPAdress(),
  optimizeLoaders,
  eslint: getEslintRules(),
  cssLoaders: cssLoaders(),
};