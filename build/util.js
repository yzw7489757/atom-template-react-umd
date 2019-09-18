const os = require('os');
const path = require('path');
const formatter = require('eslint-friendly-formatter');
const HtmlWebpackPlugin = require('html-webpack-plugin');

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

// HTML
const htmlPlugins = () => {
  const template = resolve('public/index.html');
  const minify = {
    removeComments: true, // 注释
    collapseWhitespace: true, // 缩减文本空白
    removeAttributeQuotes: true, // 属性周围的引号
    removeEmptyAttributes: true, // 所有空属性值
  };
  return [
    new HtmlWebpackPlugin({
      template,
      inject: true,
      chunksSortMode: 'none', // 不对插入的js进行排序
      ...(IS_PROD ? minify : {}),
    }),
  ];
};

function getIPAdress() {
  // 获取本地ip 开启局域网访问
  let useAddress;
  const interfaces = os.networkInterfaces();
  Object.keys(interfaces).forEach((key) => {
    const iface = interfaces[key].filter(alias => alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal)[0];
    if (iface) {
      useAddress = iface.address;
    }
  });
  return useAddress;
}

module.exports = {
  IS_PROD,
  resolve,
  htmlPlugins,
  dllModule: vendors,
  getIp: getIPAdress,
  eslint: getEslintRules,
};
